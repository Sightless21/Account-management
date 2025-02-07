"use client";
import * as React from "react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";


//TODO : สร้างหน้า ClaimExpenses
export default function Page() {
  //const session = getServerSession(authOptions)
  const { data: sessionUser } = useSession() as {
    data: Session | null;
    status: string;
  };
  return (
    <>
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      <p>{sessionUser?.user?.id}</p>
    </>
  );
}
