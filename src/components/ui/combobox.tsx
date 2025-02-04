"use client"

import { useState } from "react"
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

type Option = { label: string; value: string }

interface ComboboxProps {
  name: string
  options: Option[]
  placeholder?: string
  value?: string[] // รองรับหลายค่า
  onChange?: (value: string[]) => void
  disabled?: boolean
}

export function Combobox({ name, options, placeholder, value = [], onChange, disabled }: ComboboxProps) {
  const [open, setOpen] = useState(false)

  const toggleValue = (selectedValue: string) => {
    const newValues = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue) // ลบออกถ้ามีอยู่แล้ว
      : [...value, selectedValue] // เพิ่มเข้าไปถ้ายังไม่มี

    onChange?.(newValues) // อัปเดตค่าไปที่ form
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between" disabled={disabled}>
          {value.length > 0
            ? options
                .filter((option) => value.includes(option.value))
                .map((option) => option.label)
                .join(", ")
            : placeholder || "Select an option"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  toggleValue(option.value) // อัปเดตค่า
                  if (value.length === 0) setOpen(false) // ปิดเฉพาะครั้งแรกที่เลือก
                }}
              >
                <Check className={`mr-2 h-4 w-4 ${value.includes(option.value) ? "opacity-100" : "opacity-0"}`} />
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}