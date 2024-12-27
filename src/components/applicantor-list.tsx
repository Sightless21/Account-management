import { Applicator, applicantor } from '../app/dashboard/Applicant/data/applicator'
import React from 'react';
import SortableUser from '@/components/applicantor-sortable'

export default function ApplicantorList() {
    return (
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" >
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                <ul>
                    {applicantor.map((person: Applicator) => (
                        <SortableUser person={person} key={person.id} />
                    ))}
                </ul>
            </h1>
        </div>
    );
}