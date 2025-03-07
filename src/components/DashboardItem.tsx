/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NumberCard } from "@/components/DashboardCard";
import { Briefcase, Calendar, Car, DollarSign, FileText, GripVertical, LucideIcon, ClipboardList } from "lucide-react";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTask } from "@/hooks/useTaskData";
import { useExpenses } from "@/hooks/useExpenseData";
import { useApplicantData } from "@/hooks/useApplicantData";
import { useRoomBookings } from "@/hooks/useRoomBookingData";
import { useDayOff } from "@/hooks/useDayOffData"
import { useCarReservation } from "@/hooks/useCarReservationData"
import { format } from "date-fns/format";
// Type definitions
interface DashboardItem {
  id: string;
  type: 'number';
  title?: string;
  description?: string;
  icon?: LucideIcon;
  value?: number;
  valueColorClass?: string;
  badgeText?: string;
  badgeVariant?: 'outline' | 'default' | 'secondary' | 'destructive';
  badgeColorClass?: string;
}

// SortableItem Component
const SortableItem: React.FC<{ id: string; children: React.ReactNode; isOver: boolean }> = ({ id, children, isOver }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges: () => false,
    transition: { duration: 150, easing: 'ease-out' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '100%',
    opacity: isOver ? 0.5 : 1, // ลด opacity เมื่อมีการ์ดอื่นลากมาทับ
  };

  return (
    <div ref={setNodeRef} style={style} className="relative h-full">
      <div className="absolute top-2 right-2 z-10">
        <GripVertical
          className="h-5 w-5 text-muted-foreground cursor-grab hover:text-gray-600 transition-colors"
          {...attributes}
          {...listeners}
        />
      </div>
      {children}
    </div>
  );
};

// DragOverlayItem Component
const DragOverlayItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const style = {
    opacity: 0.9,
    transform: 'scale(1)',
    boxShadow: "0 6px 12px rgba(0,0,0,0.30)",
    cursor: "grabbing",
    width: '100%',
  };

  return (
    <div style={style}>
      {children}
    </div>
  );
};

// Placeholder Component
const PlaceholderCard = () => (
  <div className="w-full h-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
    <span className="text-gray-400">Drop here</span>
  </div>
);

export default function DashboardItem() {

  const { data: tasks, isLoading: tasksLoading } = useTask()
  const { data: expenses, isLoading: expensesLoading } = useExpenses()
  const { data: applicants, isLoading: applicantsLoading } = useApplicantData()
  const { data: roomBookings, isLoading: roomBookingsLoading } = useRoomBookings()
  const { data: dayOffs, isLoading: dayOffsLoading } = useDayOff()
  const { data: carReservations, isLoading: carReservationsLoading } = useCarReservation()

  const isLoading = tasksLoading || expensesLoading || applicantsLoading || roomBookingsLoading || dayOffsLoading || carReservationsLoading;

  const applicantsCount = applicants?.filter((applicant) => applicant.status === "NEW" || applicant.status === "PENDING_INTERVIEW" || applicant.status === "INTERVIEW_PASSED").length ?? 0;
  const applicantsTodayCount = applicants?.filter((applicant) => format(applicant.createdAt || new Date(), "yyyy-MM-dd") === format(new Date().toLocaleDateString(), "yyyy-MM-dd")).length ?? 0;

  const dayOffsCount = dayOffs?.filter((dayOff) => dayOff.status === "Pending").length ?? 0;
  const dayOffsTodayCount = dayOffs?.filter((dayOff) => format(dayOff.createdAt || new Date(), "yyyy-MM-dd") === format(new Date().toLocaleDateString(), "yyyy-MM-dd")).length ?? 0;

  const expensesCount = expenses?.filter((booking) => booking.status === "Pending").length ?? 0;
  const expensesTodayCount = expenses?.filter((booking) => format(booking.createdAt || new Date(), "yyyy-MM-dd") === format(new Date().toLocaleDateString(), "yyyy-MM-dd")).length ?? 0;
  const roomBookingsCount = roomBookings?.filter((roomBooking) => 
    format(roomBooking.date, "yyyy-MM-dd") === format(new Date().toLocaleDateString(), "yyyy-MM-dd") 
  && new Date(`1970-01-01T${roomBooking.endTime}`).getTime() < new Date().getTime()).length ?? 0;

  const carReservationsCount = carReservations?.filter((carReservation) => carReservation.tripStatus === "ONGOING").length ?? 0;
  const carReservationsTodayCount = carReservations?.filter((carReservation) => format(carReservation.createdAt || new Date(), "yyyy-MM-dd") === format(new Date().toLocaleDateString(), "yyyy-MM-dd")).length ?? 0;

  const taskCount = tasks?.filter((task) => task.status === "TODO").length ?? 0;
  const taskTodayCount = tasks?.filter((task) => format(task.createdAt || new Date(), "yyyy-MM-dd") === format(new Date().toLocaleDateString(), "yyyy-MM-dd")).length ?? 0;

  const [items, setItems] = useState<DashboardItem[]>([
    {
      id: 'job', type: 'number',
      title: "Job Applications",
      description: "New applications",
      icon: Briefcase, value: isLoading ? 0 : applicantsCount,
      valueColorClass: "text-green-500",
      badgeText: `${applicantsTodayCount} new today`,
      badgeVariant: "outline",
      badgeColorClass: "bg-green-500/10 text-green-500"
    },
    {
      id: 'leave', type: 'number',
      title: "Leave Requests",
      description: "Pending approvals",
      icon: FileText, value: isLoading ? 0 : dayOffsCount,
      valueColorClass: "text-amber-500",
      badgeText: `${dayOffsTodayCount} new today`,
      badgeVariant: "outline",
      badgeColorClass: "bg-amber-500/10 text-amber-500"
    },
    {
      id: 'expense', type: 'number',
      title: "Expense Requests",
      description: "Awaiting approval",
      icon: DollarSign, value: isLoading ? 0 : expensesCount,
      valueColorClass: "text-red-500",
      badgeText: `${expensesTodayCount} new today`,
      badgeVariant: "outline",
      badgeColorClass: "bg-red-500/10 text-red-500"
    },
    {
      id: 'meeting', type: 'number',
      title: "Meeting Rooms",
      description: "Bookings today",
      icon: Calendar, value: isLoading ? 0 : roomBookingsCount,
      badgeText: roomBookingsCount === 0 ? "No bookings today" : "Active Now",
      badgeVariant: "outline",
      badgeColorClass: "bg-primary/10 text-primary"
    },
    {
      id: 'vehicle', type: 'number',
      title: "Vehicle Bookings",
      description: "Pending requests",
      icon: Car, value: isLoading ? 0 : carReservationsCount,
      badgeText: `${carReservationsTodayCount} new today`,
      badgeVariant: "outline"
    },
    {
      id: 'tasks', type: "number",
      title: "Tasks",
      description: "Pending tasks",
      icon: ClipboardList, value: isLoading ? 0 : taskCount,
      badgeText: `${taskTodayCount} new today`,
      badgeVariant: "outline" 
    },
  ]);

  useEffect(() => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        switch (item.id) {
          case 'job': return { ...item, value: applicantsCount , badgeText: `${applicantsTodayCount} new today`};
          case 'leave': return { ...item, value: dayOffsCount , badgeText: `${dayOffsTodayCount} new today` };
          case 'expense': return { ...item, value: expensesCount  , badgeText: `${expensesTodayCount} new today`};
          case 'meeting': return { ...item, value: roomBookingsCount , badgeText: roomBookingsCount === 0 ? "No bookings today" : "Active Now" };
          case 'vehicle': return { ...item, value: carReservationsCount , badgeText: `${carReservationsTodayCount} new today`};
          case 'tasks': return { ...item, value: taskCount , badgeText: `${taskTodayCount} new today`};
          default: return item;
        }
      })
    );
  }, [taskCount, expensesCount, applicantsCount, roomBookingsCount, dayOffsCount, carReservationsCount, applicantsTodayCount, dayOffsTodayCount, expensesTodayCount, carReservationsTodayCount, taskTodayCount]);



  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = useCallback((event: any) => {
    const { over } = event;
    setOverId(over?.id || null);
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex(item => item.id === active.id);
        const newIndex = prevItems.findIndex(item => item.id === over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
    setActiveId(null);
    setOverId(null);
  }, []);

  const activeItem = useMemo(() =>
    items.find(item => item.id === activeId),
    [items, activeId]
  );

  const renderItemContent = (item: DashboardItem) => (
    <div className="w-full h-full">
      <NumberCard
        title={item.title ?? ""}
        description={item.description ?? ""}
        icon={item.icon as LucideIcon}
        value={item.value ?? 0}
        valueColorClass={item.valueColorClass}
        badgeText={item.badgeText}
        badgeVariant={item.badgeVariant}
        badgeColorClass={item.badgeColorClass}
        className="hover:shadow-lg duration-300 transition-all"
      />
    </div>
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(item => item.id)}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              isOver={activeId !== null && overId === item.id}
            >
              {item.id === activeId ? (
                <PlaceholderCard />
              ) : (
                renderItemContent(item)
              )}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeItem && (
          <DragOverlayItem>
            {renderItemContent(activeItem)}
          </DragOverlayItem>
        )}
      </DragOverlay>
    </DndContext>
  );
}