// src/app/api/auth/user/profile/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFileToCloud , deleteFileOnCloud} from "@/lib/cloudinaryUtils"; // Helper function (see below)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const employeeId = user.employeeId;
    if (!employeeId) {
      return NextResponse.json({ user },{ status: 200 });
    }

    const [documents, employee] = await Promise.all([
      prisma.document.findMany({ where: { employeeId } }),
      prisma.employee.findUnique({ where: { id: employeeId } }),
    ]);

    return NextResponse.json({ user, documents, employee } ,{ status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching profile:", error || "Unknown error occurred");
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await req.json();
  console.log("Data that PATCH:", data);

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id },
      include: { employee: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let profileImage = data.avatar || currentUser.profileImage;
    let profilePublicImageId = data.avatarPublicId || currentUser.profilePublicImageId;

    // จัดการ Cloudinary
    if (data.avatar && data.avatar.startsWith("data:image")) {
      console.log("Uploading new avatar to Cloudinary...");
      if (currentUser.profilePublicImageId) {
        await deleteFileOnCloud(currentUser.profilePublicImageId);
      }
      const uploadResult = await uploadFileToCloud(data.avatar, {
        folder: "user_avatars",
      });
      profileImage = uploadResult?.secure_url;
      profilePublicImageId = uploadResult?.public_id;
    } else if (data.avatar === "" && currentUser.profilePublicImageId) {
      console.log("Removing existing avatar from Cloudinary...");
      await deleteFileOnCloud(currentUser.profilePublicImageId);
      profileImage = null;
      profilePublicImageId = null;
    }

    // อัปเดต user และ employee
    console.log("Updating user and employee...");
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName: data.user?.firstName,
        lastName: data.user?.lastName,
        email: data.user?.email,
        phone: data.profile?.person?.phone,
        profileImage,
        profilePublicImageId,
        employee: data.profile || data.info || data.birthdate || data.military || data.marital || data.dwelling
          ? {
              upsert: {
                update: {
                  person: data.profile?.person ? {
                    name: data.profile.person.fullName,
                    phone: data.profile.person.phone,
                    email: data.profile.person.email,
                    position: data.profile.person.position,
                    expectSalary: data.profile.person.salary,
                  } : undefined,
                  birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
                  info: data.info,
                  military: data.military,
                  marital: data.marital,
                  dwelling: data.dwelling,
                },
                create: {
                  person: data.profile?.person ? {
                    name: data.profile.person.fullName,
                    phone: data.profile.person.phone,
                    email: data.profile.person.email,
                    position: data.profile.person.position,
                    expectSalary: data.profile.person.salary,
                  } : {},
                  birthdate: data.birthdate ? new Date(data.birthdate) : new Date(),
                  info: data.info || {},
                  military: data.military || "pass",
                  marital: data.marital || "single",
                  dwelling: data.dwelling || "familyHouse",
                },
              },
            }
          : undefined,
      },
      include: { employee: true },
    });

    // อัปเดต documents
    if (data.documents && Array.isArray(data.documents)) {
      if (!updatedUser.employeeId) {
        throw new Error("Employee ID is missing after user update");
      }
      console.log("Updating documents for employeeId:", updatedUser.employeeId);
      await prisma.document.deleteMany({ where: { employeeId: updatedUser.employeeId } });
      await prisma.document.createMany({
        data: data.documents.map((docName: string) => ({
          name: docName,
          employeeId: updatedUser.employeeId!,
        })),
      });
    }

    console.log("Profile updated successfully:", updatedUser);
    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error: unknown) {
    console.error("Error updating profile:", error instanceof Error ? error.message : "Unknown error occurred", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}