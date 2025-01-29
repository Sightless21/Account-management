/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Column } from "./Columns";
import { BurnBarrel } from "./BurnBarrel";

type BoardProp = {
  data: any;
  projectID: string | null;
  projectName: string | null;
};

export const Board = ({ data, projectID, projectName }: BoardProp) => {
  return (
    <div className="flex gap-5 p-2">
      <Column
        title="Todo"
        column="todo"
        headingBgColor="bg-blue-200/25 border border-blue-600"
        headingColor="text-blue-600 uppercase"
        cards={data}
        projectID={projectID}
        projectName={projectName}
      />
      <Column
        title="Doing"
        column="doing"
        headingBgColor="bg-yellow-200/25 border border-yellow-600"
        headingColor="text-yellow-600 uppercase"
        cards={data}
        projectID={projectID}
        projectName={projectName}
      />
      <Column
        title="Done"
        column="done"
        headingBgColor="bg-emerald-200/25 border border-emerald-600"
        headingColor="text-emerald-600 uppercase"
        cards={data}
        projectID={projectID}
        projectName={projectName}
      />
      <BurnBarrel />
    </div>
  );
};
