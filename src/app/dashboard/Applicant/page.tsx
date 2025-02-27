"use client";

import { ApplicantBoard } from "@/components/DnDApplicant/ApplicantBoard";
// import ModalApplicant from "@/components/Modal/modal-Applicant";
import { ApplicantDialog } from "@/components/Modal/modal-ApplicantV2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableOfContents } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import { useApplicantData } from "@/hooks/useApplicantData"

export default function Page() {
  const { data: applicants, isLoading, } = useApplicantData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(" ");


  function handleProbationPage() {
    router.push("/Dashboard/Applicant/Probation");
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
              className="w-64 rounded-lg border border-gray-300 px-3 h-8 py-2"
            />
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="w-[200px] h-8">
                <SelectValue placeholder="Filter Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Position</SelectItem>
                {[...new Set(applicants?.map((applicant) => applicant.person.position))].map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ApplicantDialog />
            <Button variant={"outline"} className="h-8" onClick={handleProbationPage}>
              Probationary Officer Table <TableOfContents />
            </Button>
          </div>
          <ApplicantBoard
            data={applicants}
            searchQuery={searchQuery}
            selectProsition={selectedPosition}
          />
        </CardContent>
      </Card>
    </div>
  );
}