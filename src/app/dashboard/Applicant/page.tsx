"use client";

import { ApplicantBoard } from "@/components/DnDApplicant/ApplicantBoard";
import ModalApplicant from "@/components/Modal/modal-Applicant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApplicantData } from "@/hooks/useApplicantData"; // ใช้ hook ใหม่
import { TableOfContents } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { applicants, fetchApplicants, isLoading } = useApplicantData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(" ");

  useEffect(() => {
    fetchApplicants(); // รีเฟรชข้อมูลเมื่อโหลดหน้า
  }, [fetchApplicants]);

  function handleProbationPage() {
    toast.loading("Loading data", { duration: 2000 });
    router.push("/Dashboard/Applicant/Probation");
    fetchApplicants().then(() => {
      toast.dismiss();
      toast.success("Successfully loaded data");
    }).catch((error) => {
      toast.error(error.message || "Failed to load data");
    });
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="m-3 flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 p-2">
          <CardTitle className="flex text-2xl justify-center">Applicant Board</CardTitle>
        </CardHeader>
        <CardContent className="h-full mb-3">
          <div className="flex flex-row gap-3 ml-4">
            <Input
              type="text"
              placeholder="Search Task name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-lg border border-gray-300 px-3 py-2"
            />
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Position</SelectItem>
                {[...new Set(applicants.map((applicant) => applicant.person.position))].map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ModalApplicant mode={"create"} />
            <Button variant={"outline"} onClick={handleProbationPage}>
              Probationary Officer Table <TableOfContents />
            </Button>
          </div>
          <ApplicantBoard
            data={applicants}
            searchQuery={searchQuery}
            selectProsition={selectedPosition}
          />
        </CardContent>
        <CardFooter>
          <p className={isLoading ? "text-yellow-500" : "text-green-500"}>
            {isLoading ? "Loading..." : "Loaded Success"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}