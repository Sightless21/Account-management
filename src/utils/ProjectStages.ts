import { Project, ProjectStage, StageStatus } from "@/types/projects";

// ฟังก์ชันคำนวณ overall progress ของโปรเจกต์จาก task ที่ DONE
function calculateProjectProgress(tasks: Project["task"]): number {
  const totalTasks = tasks.length;
  if (totalTasks === 0) return 0;

  const completedTasks = tasks.filter((task) => task.status === "DONE").length;
  return Number(((completedTasks / totalTasks) * 100).toFixed(2)); // คืนค่าเป็นทศนิยม 2 ตำแหน่ง
}

// ฟังก์ชันกำหนด status ของโปรเจกต์จาก task statuses
function determineProjectStatus(tasks: Project["task"]): StageStatus {
  const totalTasks = tasks.length;
  if (totalTasks === 0) return "NOT_STARTED"; // ถ้าไม่มี task ให้เป็น NOT_STARTED

  const doneCount = tasks.filter((task) => task.status === "DONE").length;
  const doingCount = tasks.filter((task) => task.status === "DOING").length;

  if (doneCount === totalTasks) {
    return "COMPLETED"; // ทุก task เป็น DONE
  } else if (doingCount > 0 || doneCount > 0) {
    return "IN_PROGRESS"; // มี task ที่ DOING หรือ DONE (แต่ไม่ครบทุกอัน)
  } else {
    return "NOT_STARTED"; // ทุก task เป็น TODO
  }
}

export function mapBackendToProjectStages(project: Project): ProjectStage[] {
  // คำนวณ overall progress ของโปรเจกต์
  const overallProgress = calculateProjectProgress(project.task);

  // กำหนด status ของโปรเจกต์จาก task statuses
  const projectStatus = determineProjectStatus(project.task);

  // หา startDate และ endDate จาก task (ใช้ task แรกสุดและสุดท้าย)
  const startDate = project.createdAt ? new Date(project.createdAt) : new Date();
  const endDate = project.task.length > 0
    ? new Date(Math.max(...project.task.map((task) => new Date(task.dueDate || task.updatedAt || Date.now()).getTime())))
    : new Date(); // Fallback เป็นวันที่ปัจจุบันถ้าไม่มี task

  // คืนค่า ProjectStage เดียวสำหรับโปรเจกต์นี้
  return [
    {
      id: project.id, // ใช้ project id แทน task id
      title: project.projectName,
      description: project.description,
      status: projectStatus,
      startDate,
      endDate,
      progress: overallProgress,
      projectId: project.id,
    } as ProjectStage,
  ];
}

// ฟังก์ชันเพิ่มเติม: Export overall progress แยกออกไป
export function getProjectOverallProgress(project: Project): number {
  return calculateProjectProgress(project.task);
}