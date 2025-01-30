"use client";

import React, { useState } from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Pencil, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProjectStore } from "@/hooks/useProjectStore";
import { toast } from "sonner";

interface RadialChartProps {
  data: { name: string; value: number; fill: string }[];
  config: ChartConfig;
  title: string;
  value: number;
  projectID: string;
  description?: string;
  footerText?: string;
}

export function RadialChart({
  data,
  config,
  title,
  value,
  projectID,
  description,
  footerText,
}: RadialChartProps) {
  const { updateNameProject, deleteProject } = useProjectStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleSave = async () => {
    setIsEditing(false); // ปิดโหมด edit
    if (newTitle.trim() !== "" && newTitle !== title) {
      try {
        // ยิง API เพื่ออัปเดตชื่อ
        toast.promise(updateNameProject(projectID, newTitle), {
          loading: "Updating project name...",
          success: "Successfully update project name",
          error: "Error updating project name",
        })
        console.log("Project name updated successfully");
      } catch (error) {
        console.error("Failed to update project name:", error);
        setNewTitle(title); // ถ้าการอัปเดตล้มเหลว ให้ revert กลับ
      }
    } else if (newTitle.trim() === "") {
      setNewTitle(title); // ถ้าค่าว่าง ให้ revert กลับ
    }
  };
  const router = useRouter();

  return (
    <Card className="flex flex-col transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
      <CardHeader className="static items-center pb-0">
        {isEditing ? (
          <Input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            className="w-full"
            autoFocus
          />
        ) : (
          <div
            className="group flex cursor-pointer items-center gap-2 hover:underline"
            onClick={() => setIsEditing(true)}
          >
            <CardTitle>{title}</CardTitle>
            <Pencil
              size={20}
              className="text-muted-foreground transition-colors group-hover:text-foreground"
            />
          </div>
        )}
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={data}
            startAngle={0}
            endAngle={value}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {data[0].value.toFixed(0)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {config.value.label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-8 text-sm">
        <div className="leading-none text-muted-foreground">{footerText}</div>
        <Button
          onClick={() => {
            if (title) {
              router.push(`/dashboard/ProjectBoard/${title}`);
            }
          }}
        >
          View Tasks
        </Button>
        <div className="flex flex-row">
          <Button
            variant={"ghost"}
            className="hover:bg-red-300"
            onClick={() => toast.promise(deleteProject(projectID), {
              loading: "Deleting project...",
              success: "Successfully delete project",
              error: "Error deleting project",
            })}
          >
            <Trash />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
