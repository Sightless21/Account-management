/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CropModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onCropComplete: (croppedImage: string) => void
}

export function CropModal({ isOpen, onClose, imageSrc, onCropComplete }: CropModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 128, // Start with a smaller circular crop (50% of the image width)
    height: 128, // Match height to width for a circle
    x: 25, // Center the crop horizontally
    y: 25, // Center the crop vertically
    aspect: 1, // Ensure 1:1 aspect ratio for a circle
  })
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)

  const onCrop = () => {
    if (imageRef && crop.width && crop.height) {
      const canvas = document.createElement("canvas")
      const scaleX = imageRef.naturalWidth / imageRef.width
      const scaleY = imageRef.naturalHeight / imageRef.height
      const pixelRatio = window.devicePixelRatio

      canvas.width = 128 // Desired output width for a circular crop
      canvas.height = 128 // Match height for a circle

      const ctx = canvas.getContext("2d")

      if (ctx) {
        ctx.imageSmoothingQuality = "high"

        const cropX = crop.x * scaleX
        const cropY = crop.y * scaleY
        const cropWidth = crop.width * scaleX
        const cropHeight = crop.height * scaleY

        ctx.drawImage(imageRef, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height)

        const base64Image = canvas.toDataURL("image/jpeg", 0.9)
        onCropComplete(base64Image)
        onClose()
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Adjust the crop area to select the visible part of your profile picture.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex items-center justify-center">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={1} // 1:1 aspect ratio for a circle
            circularCrop // Enable circular crop mask
            className="w-[400px] h-[400px]" // Force square container for a perfect circle
          >
            <img
              ref={setImageRef}
              src={imageSrc || "/placeholder.svg"}
              alt="Crop preview"
              className="w-full h-full object-cover" // Use object-contain to show the full image
              style={{ maxWidth: "100%", maxHeight: "100%" }} // Ensure image doesn’t overflow
            />
          </ReactCrop>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onCrop}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}