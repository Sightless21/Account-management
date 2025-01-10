
import React from "react";
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

const page = async () => {
    const data = await getData()
    return (
        <div className="container mx-auto py-10 px-8">
            <DataTable columns={columns} data={data} />
        </div>
    );
}

export default page