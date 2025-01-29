/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect } from "react";
import { Column } from "./Columns";
import BurnBarrel from "./BurnBarrel";

type BoardProp = {
  data: any;
  refetch: any
}

export const Board = ({data , refetch}: BoardProp) => {
  useEffect(() => {
    refetch(); 
}, [refetch]);

  return (
    <div className="flex gap-5 p-2">
      <Column
        title="Applicant"
        column="NEW"
        headingBgColor="bg-blue-200/25 border border-blue-600"
        headingColor="text-blue-600 uppercase"
        cards={data}
      />
      <Column
        title="In progress interview"
        column="PENDING_INTERVIEW"
        headingBgColor="bg-yellow-200/25 border border-yellow-600"
        headingColor="text-yellow-600 uppercase"
        cards={data}
      />
      <Column
        title="Interview pass"
        column="INTERVIEW_PASSED"
        headingBgColor="bg-emerald-200/25 border border-emerald-600"
        headingColor="text-emerald-600 uppercase"
        cards={data}
      />
      <BurnBarrel />
    </div>
  );
};