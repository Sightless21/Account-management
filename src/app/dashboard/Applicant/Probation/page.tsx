import React from "react";
// import { useRouter } from 'next/navigation'
import { Applicant, columns } from "./columns"
import { DataTable } from "./data-table"
async function getData(): Promise<Applicant[]> {
    const res = await fetch('https://678481d91ec630ca33a49940.mockapi.io/api/users/users')
    const data = await res.json()
    return data
}

export default async function Page() {
    const data = await getData()
    return (
        <div className="flex flex-col gap-4 ml-3 mr-3">
            <div className="flex items-center justify-between scroll-m-20 border-b pb-2 mr-3 text-3xl font-semibold tracking-tight first:mt-0">
                Probation Applicants Table
            </div>
            <div className="container mx-auto py-3 px-8">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    );
}