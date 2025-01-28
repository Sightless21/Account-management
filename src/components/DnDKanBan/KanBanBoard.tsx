"use client";

import React, { useEffect } from "react";
import { Board } from "./Board";
import { useTaskStore } from '@/hooks/useTaskStore';

interface KanBanBoardProps {
  projectName: string | null;
  projectID: string | null;
}

export const KanBanBoard: React.FC<KanBanBoardProps> = ({ projectName, projectID }) => {
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    if (projectID) {
      fetchTasks(projectID);
    }else{
      return;
    }
  }, [projectID, fetchTasks]);

  return (
    <div className="flex flex-col p-2 gap-2 w-full h-full mt-8 justify-center items-center">
      <Board data={tasks} projectName={projectName} projectID={projectID} />
    </div>
  );
};
