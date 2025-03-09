// RoleChangeDialog.tsx
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Role } from "@/types/users";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";

interface RoleChangeDialogProps {
  employeeName: string;
  newRole: Role;
}

export const RoleChangeDialog = ({
  employeeName,
  newRole,
}: RoleChangeDialogProps) => {
  const [showDialog, setShowDialog] = useState(true);
  const [allowContinuousChange, setAllowContinuousChange] = useState(false); // ยังเก็บไว้ถ้าต้องการในอนาคต
  const [isContinuing, setIsContinuing] = useState(false);
  const [newPosition, setNewPosition] = useState("");
  const [newSalary, setNewSalary] = useState("");

  // ปิด dialog อัตโนมัติหลังจาก 3 วินาที
  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => setShowDialog(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showDialog]);

  const handleCancel = () => {
    setShowDialog(false);
  };

  const handleSaveAll = () => {
    setShowDialog(false);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="w-fit">
        <DialogHeader>
          <DialogTitle>Role Change Confirmation</DialogTitle>
          <DialogDescription>
            {isContinuing
              ? "Please provide additional details to continue editing."
              : `The role of ${employeeName} has been changed to ${newRole}.`}
          </DialogDescription>
        </DialogHeader>

        {isContinuing ? (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="newPosition">New Position</Label>
              <Input
                id="newPosition"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="Enter new position"
              />
            </div>
            <div>
              <Label htmlFor="newSalary">New Salary (THB)</Label>
              <Input
                id="newSalary"
                type="number"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                placeholder="Enter new salary"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 py-4">
            <Checkbox
              id="continuousChange"
              checked={allowContinuousChange}
              onCheckedChange={(checked) => setAllowContinuousChange(checked as boolean)}
            />
            <Label htmlFor="continuousChange">Allow continuous role changes (5 minutes)</Label>
          </div>
        )}

        <DialogFooter>
          {isContinuing ? (
            <>
              <Button variant="outline" onClick={() => setIsContinuing(false)}>
                <X className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleSaveAll}>
                <Check className="mr-2 h-4 w-4" /> Save All
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Close
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};