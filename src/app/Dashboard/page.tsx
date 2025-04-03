'use client'
import React  from 'react';
import DashboardItem from "@/components/DashboardItem"
import ProjectStagesDashboard from "@/components/Project-Stages-Dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function Page() {

  return (
    <Card className="m-3 flex flex-col p-2">
      <CardContent className='p-0 flex-col'>
        <Card className='border-0 shadow-none'>
          <CardHeader className="p-2 sm:p-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl">Active Projects</CardTitle>
            <CardDescription className="text-sm md:text-base">Recents Project Progressing</CardDescription>
          </CardHeader>
          <CardContent className="flex p-2 flex-row justify-center items-center rounded-lg border bg-card text-card-foreground shadow-sm">
            <ScrollArea className="w-[1350px] max-h-[400px] sm:max-h-[500px] whitespace-nowrap">
              <div className="flex space-x-4 pb-4">
                <div className="min-w-[250px] sm:min-w-[300px] flex-1">
                  <ProjectStagesDashboard />
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>

        <CardHeader className='mt-0'>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Dashboard Overview System</CardDescription>
        </CardHeader>
        <CardContent className="p-2 overflow-x-hidden">
          <DashboardItem />
        </CardContent>
      </CardContent>
    </Card>
  );
}