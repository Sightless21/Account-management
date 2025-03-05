/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleChevronUp, CircleChevronRight, CircleChevronDown , CircleFadingPlus} from "lucide-react";

interface FilterProps<T> {
  data: T[];
  searchKey: string; // รองรับ path เช่น "taskName" หรือ "person.name"
  searchPlaceholder: string;
  filterKey: string; // รองรับ path เช่น "priority" หรือ "person.position"
  filterOptions: string[]; // ตัวเลือกสำหรับกรอง (เช่น ["HIGH", "MEDIUM", "LOW"] หรือ ["Software Engineer", "UX Designer"])
  onFilterChange: (filteredData: T[]) => void;
  filterLabel?: string; // ข้อความในปุ่ม (เช่น "Priority" หรือ "Position")
}

export const FilterComponent = <T,>({
  data,
  searchKey,
  searchPlaceholder,
  filterKey,
  filterOptions,
  onFilterChange,
  filterLabel = "Priority",
}: FilterProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([" "]); // เปลี่ยนค่าเริ่มต้นเป็น [" "] เพื่อเลือก "All"

  // Memoize getFilterCounts เพื่อป้องกันการสร้างฟังก์ชันใหม่ในทุก re-render
  const getFilterCounts = useCallback((items: T[], key: string): Record<string, number> => {
    const counts: Record<string, number> = {};
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    items.forEach((item) => {
      const value = String(getNestedValue(item, key) || "");
      counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
  }, []);

  const filterCounts = useMemo(() => getFilterCounts(data, filterKey), [data, filterKey, getFilterCounts]);

  const filteredData = useMemo(() => {
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    return data.filter((item) => {
      const searchValue = String(getNestedValue(item, searchKey) || "").toLowerCase();
      const matchesSearch = searchValue.includes(searchQuery.toLowerCase());

      const filterValue = String(getNestedValue(item, filterKey) || "");
      const matchesFilter = selectedFilters.includes(" ") || selectedFilters.includes(filterValue);

      return matchesSearch && matchesFilter;
    });
  }, [data, searchKey, filterKey, searchQuery, selectedFilters]);

  // ใช้ useRef เพื่อเก็บค่า filteredData เดิมและเปรียบเทียบก่อนเรียก onFilterChange
  const prevFilteredData = useRef<T[]>(filteredData);

  useEffect(() => {
    // เรียก onFilterChange เฉพาะเมื่อ filteredData เปลี่ยนแปลงจริง ๆ
    if (JSON.stringify(prevFilteredData.current) !== JSON.stringify(filteredData)) {
      onFilterChange(filteredData);
      prevFilteredData.current = filteredData;
    }
  }, [filteredData, onFilterChange]);

  // ฟังก์ชันเพื่อกำหนดไอคอนตามตัวเลือก (สำหรับ priority หรือ position)
  const getIcon = (option: string) => {
    if (selectedFilters.includes(option)) {
      if (option === "LOW" ) return <CircleChevronDown className="h-4 w-4 text-black dark:text-white" />;
      if (option === "MEDIUM" ) return <CircleChevronRight className="h-4 w-4 text-black dark:text-white" />; 
      if (option === "HIGH" ) return <CircleChevronUp className="h-4 w-4 text-black dark:text-white" />; 
    }
    return null; // ไม่แสดงไอคอนถ้ายังไม่เลือก
  };

  // ฟังก์ชันจัดการการเลือก/ยกเลิกเลือกใน multi-select
  const handleCheckboxChange = (option: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      if (option === " ") {
        return checked ? [" "] : []; // ถ้าเลือก "All" จะล้างหรือตั้งค่าเป็น [" "]
      } else {
        const newFilters = checked
          ? [...prev.filter((f) => f !== " "), option] // เพิ่ม option โดยไม่รวม " "
          : prev.filter((f) => f !== option && f !== " "); // ลบ option และ " " ถ้ามี
        return newFilters.length === 0 ? [" "] : newFilters; // ถ้าไม่มีตัวเลือกที่เลือก ให้กลับไป "All"
      }
    });
  };

  return (
    <div className="flex flex-row gap-3">
      <Input
        type="text"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-64 rounded-lg border border-gray-300 px-3 py-2 h-8 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-8 w-32 bg-white text-black border-dashed border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <CircleFadingPlus className="h-4 w-4"/> {filterLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-white text-black border border-gray-300 rounded-md shadow-lg dark:bg-gray-800 dark:text-white dark:border-gray-600">
          <DropdownMenuCheckboxItem
            checked={selectedFilters.includes(" ")}
            onCheckedChange={(checked) => handleCheckboxChange(" ", checked)}
            className={selectedFilters.includes(" ") ? "bg-gray-200 text-black dark:bg-gray-600 dark:text-white" : ""}
          >
            All
          </DropdownMenuCheckboxItem>
          {filterOptions.map((option) => {
            const count = filterCounts[option] || 0;
            return (
              <DropdownMenuCheckboxItem
                key={option}
                checked={selectedFilters.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange(option, checked)}
                className={selectedFilters.includes(option) ? "bg-gray-200/20 text-black dark:bg-gray-600/20 dark:text-white" : ""}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {getIcon(option)}
                    <span>{option}</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">({count})</span>
                </div>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};