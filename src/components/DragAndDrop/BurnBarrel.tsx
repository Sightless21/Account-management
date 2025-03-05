"use client";
import React, { useState, DragEvent } from "react";
import { Trash2, Flame, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BurnBarrelProps {
  onDrop?: (cardId: string) => void;
}

export const BurnBarrel = ({ onDrop }: BurnBarrelProps) => {
  const [active, setActive] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const [allowContinuousDelete, setAllowContinuousDelete] = useState(false);
  const [continuousDeleteTimeout, setContinuousDeleteTimeout] = useState<Date | null>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    if (!cardId) return;

    setActive(false);

    if (
      allowContinuousDelete &&
      continuousDeleteTimeout &&
      new Date().getTime() < continuousDeleteTimeout.getTime()
    ) {
      onDrop?.(cardId);
      return;
    }

    setPendingCardId(cardId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (pendingCardId) {
      onDrop?.(pendingCardId);

      if (allowContinuousDelete) {
        const timeout = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 นาที
        setContinuousDeleteTimeout(timeout);
      }
    }
    setShowConfirmDialog(false);
    setPendingCardId(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setPendingCardId(null);
  };

  return (
    <>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex h-[550px] w-full items-center justify-center rounded border text-3xl ${
          active
            ? "border-red-800 bg-red-800/20 text-red-500"
            : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
        }`}
      >
        {active ? <Flame className="animate-bounce" /> : <Trash2 />}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="w-fit">
          <DialogHeader>
            <DialogTitle>Confirm to delete applicant?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete applicant? This action will delete the applicant and their documents and information.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Checkbox
              id="continuousDelete"
              checked={allowContinuousDelete}
              onCheckedChange={(checked) => setAllowContinuousDelete(checked as boolean)}
            />
            <Label htmlFor="continuousDelete">Allow continuous deletion (5 minutes)</Label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              <X /> Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              <Trash2 /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};