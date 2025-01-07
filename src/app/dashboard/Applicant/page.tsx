import React from "react";
import { ApplicantBoard } from '@/components/applicant-board'
import { Button } from "@/components/ui/button";
export default function Page() {
    return (
        <>
            <div className="flex justify-center items-center mb-6">
                <Button className="bg-emerald-400 hover:bg-emerald-600">New Applicant</Button>
            </div>
            <ApplicantBoard />
        </>
    );
}