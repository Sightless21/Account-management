"use client";

import { getColumns } from "./columns";
import { DataTable } from "@/components/Table/Data-Table";
import { CarReservationDialog } from "@/components/Modal/modal-CarReservation";
import { useCarReservation } from "@/hooks/useCarReservationData";
import { useCarReservationUI } from "@/store/useCarreservationUIStore";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Role } from "@/types/users";
import { CarReservationType, TripStatus } from "@/types/car-reservation"
import { useUpdateCarReservation } from "@/hooks/useCarReservationData";
import { toast } from "sonner";
interface CarReservationTableProps {
  userRole: Role
}

export default function CarReservationTable({userRole}: CarReservationTableProps) {
  const { data: carReservations, isLoading, error } = useCarReservation();
  const { mutateAsync: updateCarReservation } = useUpdateCarReservation();
  const { openModal } = useCarReservationUI(); // Access Zustand store

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const handleAccepted = async(data : CarReservationType) => {
    console.log("✅ Approve car reservation (before update):", data);
    const newData = { ...data, tripStatus: "COMPLETED" as TripStatus };
    toast.promise(updateCarReservation(newData),{
      loading: "Updating car reservation...",
      success: "Car reservation updated successfully",
      error: "Failed to update car reservation",
    });
  }
  const handleDeclined = (data : CarReservationType) => {
    console.log("❌ Reject car reservation (before update):", data);
    const newData = { ...data, tripStatus: "CANCELLED" as TripStatus };
    toast.promise(updateCarReservation(newData), {
      loading: "Updating car reservation...",
      success: "Car reservation updated successfully",
      error: "Failed to update car reservation",
    });
  }
  const handleReset = (data: CarReservationType) => {
    console.log("Reset car reservation (before update):", data);
    const newData = { ...data, tripStatus: "ONGOING" as TripStatus };
    toast.promise(updateCarReservation(newData),{
      loading: "Updating car reservation...",
      success: "Car reservation updated successfully",
      error: "Failed to update car reservation",
    });
  }

  const columns = getColumns(userRole,{
    onApprove: handleAccepted,
    onReject: handleDeclined,
    onReset: handleReset,
  });

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={carReservations || []}
        searchColumn="employeeName"
        searchPlaceholder="Search employee name..."
        dateColumn="date"
        statusColumn="tripStatus"
        defaultVisibleColumns={["carPlate", "date", "Destination", "plateNumber", "time", "tripStatus","approval" ,"actions"]}
        statusOptions={[
          { value: "ONGOING", label: "Ongoing" },
          { value: "COMPLETED", label: "Completed" },
          { value: "CANCELLED", label: "Cancelled" },
        ]}
        toolbarAdditionalControls={
          <Button
            variant="default"
            className="h-8"
            onClick={() => openModal("create")} // Trigger create mode
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Create Reservation
          </Button>
        }
      />
      <CarReservationDialog />
    </div>
  );
}