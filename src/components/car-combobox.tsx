"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Category = {
  value: string
  label: string
}

export function CategoryCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [search, setSearch] = React.useState("")
  const [categories, setCategories] = React.useState<Category[]>([
    {
      value: "electronics",
      label: "Electronics",
    },
    {
      value: "clothing",
      label: "Clothing",
    },
    {
      value: "books",
      label: "Books",
    },
  ])

  const handleAddCategory = () => {
    if (!search) return

    const newCategory = {
      value: search.toLowerCase().replace(/\s+/g, "-"),
      label: search.trim(),
    }

    setCategories((prev) => [...prev, newCategory])
    setValue(newCategory.value)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? categories.find((category) => category.value === value)?.label : "Select category..."}
          <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>
              <Button type="button" variant="outline" className="w-full justify-start" onClick={handleAddCategory}>
                <Plus className="mr-2 h-4 w-4" />
                Add &quot;{search}&quot;
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {category.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

