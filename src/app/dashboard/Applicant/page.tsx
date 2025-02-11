"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import * as React from "react";
import ModalApplicant from "@/components/Modal/modal-Applicant";
import { ApplicantBoard } from "@/components/DnDApplicant/ApplicantBoard";
import { Card, CardTitle, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApplicantData } from "@/hooks/useApplicantData";
import { TableOfContents } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

//DONE : Applicant Page (Drag and Drop Board)
export default function Page() {
    const { applicants, fetchApplicants } = useApplicantData();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState(""); // 🔍 ค้นหา applicant name
    const [selectedPosition, setSelectedPosition] = useState(" "); // 🏷️ เลือก position
    const [loading, setLoading] = useState(false); // 🟡 สถานะโหลด

    useEffect(() => {
        setLoading(true);
        fetchApplicants()
            .then(() => {
                toast.success("Data loaded successfully", {
                    duration: 500
                });
            })
            .catch((error) => {
                toast.error(error.message || "Failed to load data");
            })
            .finally(() => setLoading(false));
    }, [fetchApplicants]);

    function handleProbationPage() {
        setLoading(true);
        toast.loading('Loading data', {
            duration: 2000
        });
        router.push("/dashboard/Applicant/Probation");
        fetchApplicants().then(() => {
            setLoading(false);
            toast.dismiss();
            toast.success('Successfully load data');
        }).catch((error) => {
            setLoading(false);
            toast.error(error.message);
        });
    }

    return (
        <div className="m-3 flex flex-col gap-4">
            <Card>
                <CardHeader className="flex flex-col gap-3 p-2">
                    <CardTitle className="flex text-2xl justify-center">Applicant Board</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row gap-3 ml-4">
                        {/* 🔍 Input สำหรับค้นหา applicant name */}
                        <Input
                            type="text"
                            placeholder="Search Task name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 rounded-lg border border-gray-300 px-3 py-2"
                        />

                        {/* 🏷️ Dropdown สำหรับกรอง position */}
                        <Select
                            value={selectedPosition}
                            onValueChange={setSelectedPosition}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">All Position</SelectItem>
                                {[
                                    ...new Set(
                                        applicants.map((applicant) => applicant.person.position),
                                    ),
                                ].map((position) => (
                                    <SelectItem key={position} value={position}>
                                        {position}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* 📝 Button เพิ่ม applicant */}
                        <ModalApplicant mode={"create"} />
                        {/* 📝 Button ตารางทดลองงาน */}
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
                    <p className={loading ? "text-yellow-500" : "text-green-500"}>
                        {loading ? "Loading..." : "Loaded Success"}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
