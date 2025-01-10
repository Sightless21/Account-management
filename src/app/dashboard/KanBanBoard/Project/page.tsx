'use client'
import React from "react";
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
export default function Page() {
    const router = useRouter();

    function handleKanBanPage() {
        router.push("/dashboard/KanBanBoard");
    }
    return (
        <>
            <div>Project</div>
            <Button onClick={handleKanBanPage} variant="outline" size="icon">
                <ChevronLeft />
            </Button>
        </>

    );
}