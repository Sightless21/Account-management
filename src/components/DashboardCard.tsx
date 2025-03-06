"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { type LucideIcon } from "lucide-react"

interface NumberCardProps {
  title: string
  description: string
  icon: LucideIcon
  value: number
  valueColorClass?: string
  badgeText?: string
  badgeVariant?: "default" | "outline" | "secondary" | "destructive"
  badgeColorClass?: string
  iconClassName?: string
  className?: string
}

export function NumberCard({
  title,
  description,
  icon: Icon,
  value,
  valueColorClass = "",
  badgeText,
  badgeVariant = "outline",
  badgeColorClass = "",
  iconClassName = "h-5 w-5 text-muted-foreground",
  className
}: NumberCardProps) {
  const ref = React.useRef(null)

  return (
    <Card className={cn(className, "w-full")} ref={ref}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
        <div className="space-y-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center bg-slate-400/20 rounded-full h-12 w-12 justify-center">
          <Icon className={`${cn(iconClassName)} text-black`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-start justify-between py-2">
          <motion.div
            className={`${cn(valueColorClass)} text-4xl font-bold`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.div>
          {badgeText && (
            <div className="mt-3 flex items-end">
              <Badge
                variant={badgeVariant}
                className={cn(
                  badgeColorClass,
                  badgeVariant === "outline" && "border-current"
                )}
              >
                {badgeText}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}