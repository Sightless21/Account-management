import React from "react";
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button"
// import { useRouter } from 'next/navigation'
import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"
import { nanoid } from "nanoid";
async function getData() : Promise<Payment[]> {
    return new Array(5).fill(null).map(() => ({
        id: nanoid(),
        amount: Math.round(Math.random() * 100),
        status: 'pending',
        email: 'bYv2y@example.com',
    }));
}

export default async function Page() {
    const data = await getData()
    return (
        <>
            <div>Probation</div>
            <Button variant="outline" size="icon">
                <ChevronLeft />
            </Button>
            <div className="container mx-auto py-10 px-8">
                <DataTable columns={columns} data={data} />
            </div>
        </>
    );
}