"use client";

import { ApplicantBoard } from "@/components/ApplicantBoard"
import { ApplicantDialog } from "@/components/Modal/modal-Applicant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableOfContents } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useMemo, useState } from "react";
import { useApplicantData, useDeleteApplicant, useUpdateApplicantStatus } from "@/hooks/useApplicantData"
import { FilterComponent } from "@/components/DragAndDrop/FilterDnD";
import { FormApplicant } from "@/types/applicant";

export default function Page() {
  const { data: applicants, isLoading } = useApplicantData();
  const { mutate: updateApplicantStatus } = useUpdateApplicantStatus();
  const { mutate: deleteApplicant } = useDeleteApplicant();
  const router = useRouter();
  const [filteredApplicants, setFilteredApplicants] = useState<FormApplicant[]>(applicants || []);

  const handleFilterChange = (filteredData: FormApplicant[]) => {
    setFilteredApplicants(filteredData);
  };

  const filterOptions = useMemo(() => {
    return [...(new Set(applicants?.map((a) => a.person.position) || []) as Set<string>).values()];
  }, [applicants]);


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
            <FilterComponent
              data={applicants || []}
              searchKey="person.name"
              searchPlaceholder="Search Applicant name..."
              filterKey="person.position"
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              filterLabel="Position"
            />
            <ApplicantDialog />
            <Button variant={"outline"} className="h-8" onClick={handleProbationPage}>
              Probationary Officer Table <TableOfContents />
            </Button>
          </div>
          <ApplicantBoard
            data={filteredApplicants}
            onUpdateStatus={(data) => updateApplicantStatus({ ...data, order: data.order ?? 0 })}
            onDelete={deleteApplicant}
          />
        </CardContent>
      </Card>
    </div>
  );
}