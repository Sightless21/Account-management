/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useMemo, useState } from "react";
import { NumberCard } from "@/components/DashboardCard";
import { Briefcase, Calendar, Car, DollarSign, FileText, GripVertical, LucideIcon, ClipboardList } from "lucide-react";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTask } from "@/hooks/useTaskData";
import { useExpenses } from "@/hooks/useExpenseData";
import { useApplicantData } from "@/hooks/useApplicantData";
import { useRoomBookings } from "@/hooks/useRoomBookingData";
import { useDayOff } from "@/hooks/useDayOffData";
import { useCarReservation } from "@/hooks/useCarReservationData";
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

// Utility to format date
const formatDate = (date: Date | undefined) => format(date || new Date(), "yyyy-MM-dd");

// SortableItem Component
const SortableItem: React.FC<{ id: string; children: React.ReactNode; isOver: boolean }> = ({ id, children, isOver }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    animateLayoutChanges: () => false,
    transition: { duration: 150, easing: 'ease-out' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '100%',
    opacity: isOver ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative h-full">
      <div className="absolute top-2 right-2 z-10">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab hover:text-gray-600 transition-colors" {...attributes} {...listeners} />
      </div>
      {children}
    </div>
  );
};

// DragOverlayItem Component
const DragOverlayItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ opacity: 0.9, transform: 'scale(1)', boxShadow: "0 6px 12px rgba(0,0,0,0.30)", cursor: "grabbing", width: '100%' }}>
    {children}
  </div>
);

// Placeholder Component
const PlaceholderCard = () => (
  <div className="w-full h-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
    <span className="text-gray-400">Drop here</span>
  </div>
);

// Dashboard Card Renderer
const DashboardCardRenderer: React.FC<{ item: DashboardItem; isLoading: boolean }> = ({ item, isLoading }) => (
  <div className="w-full h-full">
    <NumberCard
      title={item.title ?? ""}
      description={item.description ?? ""}
      icon={item.icon as LucideIcon}
      value={isLoading ? 0 : item.value ?? 0}
      valueColorClass={item.valueColorClass}
      badgeText={item.badgeText}
      badgeVariant={item.badgeVariant}
      badgeColorClass={item.badgeColorClass}
      className="hover:shadow-lg duration-300 transition-all"
    />
  </div>
);

export default function DashboardItem() {
  const { data: tasks, isLoading: tasksLoading } = useTask();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: applicants, isLoading: applicantsLoading } = useApplicantData();
  const { data: roomBookings, isLoading: roomBookingsLoading } = useRoomBookings();
  const { data: dayOffs, isLoading: dayOffsLoading } = useDayOff();
  const { data: carReservations, isLoading: carReservationsLoading } = useCarReservation();

  const isLoading = tasksLoading || expensesLoading || applicantsLoading || roomBookingsLoading || dayOffsLoading || carReservationsLoading;

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const today = format(now, "yyyy-MM-dd");

  // Calculate counts
  const counts = useMemo(() => ({
    applicants: {
      total: applicants?.filter(a => ["NEW", "PENDING_INTERVIEW", "INTERVIEW_PASSED"].includes(a.status)).length ?? 0,
      today: applicants?.filter(a => formatDate(a.createdAt ? new Date(a.createdAt) : undefined) === today).length ?? 0,
    },
    dayOffs: {
      total: dayOffs?.filter(d => d.status === "Pending").length ?? 0,
      today: dayOffs?.filter(d => formatDate(d.createdAt) === today).length ?? 0,
    },
    expenses: {
      total: expenses?.filter(e => e.status === "Pending").length ?? 0,
      today: expenses?.filter(e => formatDate(e.createdAt ? new Date(e.createdAt) : undefined) === today).length ?? 0,
    },
    roomBookings: {
      total: roomBookings?.filter(rb => {
        const bookingDate = format(rb.date, "yyyy-MM-dd");
        return bookingDate === today && currentTime >= rb.startTime && currentTime <= rb.endTime;
      }).length ?? 0,
    },
    carReservations: {
      total: carReservations?.filter(c => c.tripStatus === "ONGOING").length ?? 0,
      today: carReservations?.filter(c => formatDate(c.createdAt) === today).length ?? 0,
    },
    tasks: {
      total: tasks?.filter(t => t.status === "TODO").length ?? 0,
      today: tasks?.filter(t => formatDate(t.createdAt) === today).length ?? 0,
    },
  }), [applicants, dayOffs, expenses, roomBookings, carReservations, tasks, currentTime, today]);

  // Initial dashboard items
  const [items, setItems] = useState<DashboardItem[]>([
    {
      id: 'job',
      type: 'number',
      title: "Job Applications",
      description: "New applications",
      icon: Briefcase,
      value: counts.applicants.total,
      valueColorClass: "text-green-500",
      badgeText: `${counts.applicants.today} new today`,
      badgeVariant: "outline",
      badgeColorClass: "bg-green-500/10 text-green-500"
    },
    {
      id: 'leave',
      type: 'number',
      title: "Leave Requests",
      description: "Pending approvals",
      icon: FileText,
      value: counts.dayOffs.total,
      valueColorClass: "text-amber-500",
      badgeText: `${counts.dayOffs.today} new today`,
      badgeVariant: "outline",
      badgeColorClass: "bg-amber-500/10 text-amber-500"
    },
    {
      id: 'expense',
      type: 'number',
      title: "Expense Requests",
      description: "Awaiting approval",
      icon: DollarSign,
      value: counts.expenses.total,
      valueColorClass: "text-red-500",
      badgeText: `${counts.expenses.today} new today`,
      badgeVariant: "outline",
      badgeColorClass: "bg-red-500/10 text-red-500"
    },
    {
      id: 'meeting',
      type: 'number',
      title: "Meeting Rooms",
      description: "Bookings today",
      icon: Calendar,
      value: counts.roomBookings.total,
      badgeText: counts.roomBookings.total > 0 ? "Active Now" : "No bookings active",
      badgeVariant: "outline",
      badgeColorClass: "bg-primary/10 text-primary"
    },
    {
      id: 'vehicle',
      type: 'number',
      title: "Vehicle Bookings",
      description: "Pending requests",
      icon: Car,
      value: counts.carReservations.total,
      badgeText: `${counts.carReservations.today} new today`,
      badgeVariant: "outline"
    },
    {
      id: 'tasks',
      type: "number",
      title: "Tasks",
      description: "Pending tasks",
      icon: ClipboardList,
      value: counts.tasks.total,
      badgeText: `${counts.tasks.today} new today`,
      badgeVariant: "outline"
    },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { delay: 150, tolerance: 5 } }));

  const handleDragStart = useCallback((event: any) => setActiveId(event.active.id), []);
  const handleDragOver = useCallback((event: any) => setOverId(event.over?.id || null), []);
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems(prevItems => {
        const oldIndex = prevItems.findIndex(item => item.id === active.id);
        const newIndex = prevItems.findIndex(item => item.id === over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
    setActiveId(null);
    setOverId(null);
  }, []);

  const activeItem = useMemo(() => items.find(item => item.id === activeId), [items, activeId]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(item => item.id)}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} isOver={activeId !== null && overId === item.id}>
              {item.id === activeId ? <PlaceholderCard /> : <DashboardCardRenderer item={item} isLoading={isLoading} />}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>{activeItem && <DragOverlayItem><DashboardCardRenderer item={activeItem} isLoading={isLoading} /></DragOverlayItem>}</DragOverlay>
    </DndContext>
  );
}