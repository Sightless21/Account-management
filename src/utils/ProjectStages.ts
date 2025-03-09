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

  // หา startDate
  const startDate = project.createdAt ? new Date(project.createdAt) : new Date();

  // ฟังก์ชันช่วยแปลง dueDate
  const parseDate = (dateInput: Date | string | undefined): Date | null => {
    if (!dateInput) return null;
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return isNaN(date.getTime()) ? null : date;
  };

  // หา endDate ตามสถานะของโปรเจกต์
  let endDate: Date | null = null;

  if (project.task.length > 0) {
    if (projectStatus === "COMPLETED") {
      // สำหรับโปรเจกต์ที่จบแล้ว ใช้ updatedAt ของ task ล่าสุดที่ DONE
      const completedTasks = project.task.filter((task) => task.status === "DONE");
      if (completedTasks.length > 0) {
        const latestCompletedDate = Math.max(
          ...completedTasks
            .map((task) => parseDate(task.updatedAt))
            .filter((date): date is Date => date !== null)
            .map((date) => date.getTime())
        );
        endDate = new Date(latestCompletedDate);
      } else {
        // ถ้าไม่มี task ที่ DONE (กรณี edge case) ใช้ project.updatedAt
        endDate = parseDate(project.updatedAt) || new Date();
      }
    } else {
      // สำหรับ IN_PROGRESS หรือ NOT_STARTED ใช้ dueDate ล่าสุด
      const validDueDates = project.task
        .map((task) => parseDate(task.dueDate))
        .filter((date): date is Date => date !== null)
        .map((date) => date.getTime());

      if (validDueDates.length > 0) {
        endDate = new Date(Math.max(...validDueDates));
        // ถ้า dueDate ล่าสุดอยู่ในอดีต แต่โปรเจกต์ยังไม่จบ ให้ขยาย endDate
        if (projectStatus === "IN_PROGRESS" && endDate < new Date()) {
          endDate = new Date();
          endDate.setDate(endDate.getDate() + 7); // เพิ่ม 7 วันจากวันปัจจุบัน
        }
      }
    }
  }

  // ถ้ายังไม่มี endDate (เช่น ไม่มี task หรือไม่มี dueDate)
  if (!endDate) {
    if (projectStatus === "COMPLETED") {
      endDate = parseDate(project.updatedAt) || new Date();
    } else {
      // สำหรับ NOT_STARTED หรือ IN_PROGRESS ถ้าไม่มี dueDate ให้คำนวณจาก startDate
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30); // เพิ่ม 30 วันจาก startDate
    }
  }

  // คืนค่า ProjectStage
  return [
    {
      id: project.id,
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