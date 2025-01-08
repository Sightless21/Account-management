'use client'
import React from "react";
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
export default function Page() {
    const router = useRouter();

    function handleApplicantPage() {
        router.push("/dashboard/Applicant");
    }
    return (
        <>
            <div>Probation</div>
            <Button onClick={handleApplicantPage} variant="outline" size="icon">
                <ChevronLeft />
            </Button>
        </>
    );
}