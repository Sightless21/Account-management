'use client'
import { ApplicantBoard } from "@/components/applicant-board";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import * as React from "react"
import ModalCreateApplicant from "@/components/modal-createApplicant"

export default function Page() {
    const router = useRouter();

    function handleProbationPage() {
        router.push("/dashboard/Applicant/Probation");
    }

    return (
        <div className="flex flex-col gap-4 ml-3">
            <div className="flex items-center justify-between scroll-m-20 border-b pb-2 mr-3 text-3xl font-semibold tracking-tight first:mt-0">
                Applicant Board
                <div className="flex ml-4 gap-3">
                    <ModalCreateApplicant />
                    <Button onClick={handleProbationPage}>Probation</Button>
                </div>
            </div>
            <div className="grid place-items-center mt-[10%]">
                <ApplicantBoard />
            </div>
        </div>
    );
}