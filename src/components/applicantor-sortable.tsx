import {Applicator} from '../app/dashboard/Applicant/data/applicator'
import React from 'react'

export default function SortableApplicator( {person} : { person : Applicator}){
    return(
        <li className='flex items-center border-b border-gray-200 py-2 px-4'>
            <div className='ml-4 text-gray-700'>
                {person.name} - {person.id}
            </div>
        </li>
    )
}