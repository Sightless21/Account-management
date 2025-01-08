'use client'
import React from "react";
import { ApplicantBoard } from '@/components/applicant-board'
import { Button } from "@/components/ui/button";

import { useRouter } from 'next/navigation'

export default function Page() {

    const router = useRouter();

    function handleClick() {
        router.push('/dashboard/Applicant/Probation');
    }
    return (
        <div className="flex flex-1 flex-col gap-4  pt-0 justify-center items-start pl-4">
            <div className="flex justify-center items-center mb-6 gap-4">

                <Button className="bg-emerald-400 hover:bg-emerald-600 ">New Applicant</Button>
                <Button onClick={handleClick} className="bg-teal-400 hover:bg-teal-600">Probation</Button>

            </div>
            <ApplicantBoard />
        </div>
    );
}