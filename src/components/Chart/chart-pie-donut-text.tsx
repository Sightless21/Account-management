"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

// Define types for the chart data and props
export interface PieChartData {
  name: string
  value: number
  fill: string
}

export interface DonutChartProps {
  data: PieChartData[]
  config: ChartConfig
  title: string
  description: string
  footerTrend?: string
  footerDescription?: string
  dataKey: string
  nameKey: string
  innerRadius?: number
  strokeWidth?: number
  maxHeight?: string
}

// Reusable Donut Chart Component
export function DonutChartWithText({
  data,
  config,
  title,
  description,
  footerTrend = "Trending up by 5.2% this month",
  footerDescription = "Showing total visitors for the last 6 months",
  dataKey,
  nameKey,
  innerRadius = 60,
  strokeWidth = 5,
  maxHeight = "250px",
}: DonutChartProps) {
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [data])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square"
          style={{ maxHeight }}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={innerRadius}
              strokeWidth={strokeWidth}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {config[dataKey]?.label || "Total"}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {footerTrend} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {footerDescription}
        </div>
      </CardFooter>
    </Card>
  )
}
