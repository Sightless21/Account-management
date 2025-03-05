'use client';

import React, { useCallback, useMemo } from "react";
import { NumberCard } from "@/components/DashboardCard";
import { Briefcase, Calendar, Car, DollarSign, FileText, GripVertical, LucideIcon, ClipboardList } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
    transform: 'scale(0.98)',
    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
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
  <div className="w-full h-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
    <span className="text-gray-400">Drop here</span>
  </div>
);

export default function DashboardItem() {
  const [items, setItems] = React.useState<DashboardItem[]>([
    { id: 'meeting', type: 'number', title: "Meeting Rooms", description: "Bookings today", icon: Calendar, value: 14, badgeText: "4 active now", badgeVariant: "outline", badgeColorClass: "bg-primary/10 text-primary" },
    { id: 'leave', type: 'number', title: "Leave Requests", description: "Pending approvals", icon: FileText, value: 8, valueColorClass: "text-amber-500", badgeText: "3 urgent", badgeVariant: "outline", badgeColorClass: "bg-amber-500/10 text-amber-500" },
    { id: 'vehicle', type: 'number', title: "Vehicle Bookings", description: "Pending requests", icon: Car, value: 5, badgeText: "2 for today", badgeVariant: "outline" },
    { id: 'expense', type: 'number', title: "Expense Requests", description: "Awaiting approval", icon: DollarSign, value: 12, valueColorClass: "text-red-500", badgeText: "5 urgent", badgeVariant: "outline", badgeColorClass: "bg-red-500/10 text-red-500" },
    { id: 'job', type: 'number', title: "Job Applications", description: "New applications", icon: Briefcase, value: 18, valueColorClass: "text-green-500", badgeText: "7 new today", badgeVariant: "outline", badgeColorClass: "bg-green-500/10 text-green-500" },
    { id: 'tasks', type: "number", title: "Tasks", description: "Pending tasks", icon: ClipboardList, value: 3, badgeText: "2 due today", badgeVariant: "outline" },
  ]);
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
      />
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Overview of your website</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}