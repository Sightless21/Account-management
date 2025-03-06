/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { CameraIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CropModal } from "@/components/ui/crop-modal"
import { Trash2 } from "lucide-react"

interface AvatarUploadProps {
  value?: string
  onChange?: (value: File | null) => void
  defaultValue?: string
}

export function AvatarUpload({ value, onChange, defaultValue }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")

  // Sync preview กับ defaultValue เมื่อมันเปลี่ยน
  useEffect(() => {
    setPreview(defaultValue || null);
  }, [defaultValue]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
      setCropModalOpen(true)
    }
  }, [])

  const handleCropComplete = async (croppedImageBase64: string) => {
    const response = await fetch(croppedImageBase64)
    const blob = await response.blob()
    const file = new File([blob], "profile-image.jpg", { type: "image/jpeg" })

    setPreview(croppedImageBase64)
    onChange?.(file)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div {...getRootProps()} className="h-32 w-32 cursor-pointer">
          <Avatar className="h-full w-full">
            <input {...getInputProps()} />
            <AvatarImage src={preview || undefined} alt="Avatar" />
            <AvatarFallback className="bg-muted flex items-center justify-center h-full w-full">
              <CameraIcon className="h-10 w-10 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" {...getRootProps()}>
            Change Avatar
            <input {...getInputProps()} className="hidden" />
          </Button>
          {preview && (
            <Button
              className="text-destructive"
              type="button"
              variant={"outline"}
              size="sm"
              onClick={() => {
                setPreview(null)
                onChange?.(null)
              }}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>

      <CropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
      />
    </>
  )
}