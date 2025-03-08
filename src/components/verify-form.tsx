'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query"; // เพิ่มการ import

const MIN_PASSWORD_LENGTH = 6;
const passwordSchema = z.string().min(MIN_PASSWORD_LENGTH, "Password must be at least 6 characters long");
const formSchema = z
    .object({
        newPassword: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type VerifyFormProps = {
    userId: string;
};

export default function VerifyForm({ userId }: VerifyFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient(); // เพิ่ม queryClient
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        newPassword: "",
        confirmPassword: "",
      },
    });
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      return axios
        .post("/api/auth/first-time-login", {
          userId,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        })
        .then(async (response) => {
          if (response.status === 200) {
            await new Promise((resolve) => setTimeout(resolve, 5000)); // ⏳ หน่วง 5 วินาที
            return response.data; // ✅ return response เพื่อให้ toast รับรู้
          } else {
            throw new Error("Verification failed.");
          }
        });
    }
  
    const handleLoading = form.handleSubmit((values) => {
      toast.promise(
        onSubmit(values).then(() => {
          // Invalidate cache เพื่อให้ useUserData ดึงข้อมูลใหม่
          queryClient.invalidateQueries({ queryKey: ["user", userId] });
          router.push("/");
        }),
        {
          loading: "Verifying...",
          success: "Verified successfully!",
          error: "Error verifying",
        }
      );
    });
  
    return (
      <Card className="w-96 dark:bg-black dark:text-white">
        <CardHeader>
          <CardTitle>Verify</CardTitle>
          <CardDescription>
            You need to verify with create a new password for verification.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form className="space-y-4">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="button"
                disabled={form.formState.isSubmitting}
                onClick={handleLoading}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  }
