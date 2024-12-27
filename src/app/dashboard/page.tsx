/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from "react"
import { BoxSkeleton } from "@/components/box-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

import  { BoxChart1, BoxChart2, BoxChart3 } from "@/components/box-chart"

export default function Page() {
  const [checked, setChecked] = useState(true) // true is loading

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {checked ? (
          <BoxSkeleton />
        ) : (
          <> 
            <BoxChart1 />
            <BoxChart2 />
            <BoxChart3 />
          </>
        )}
      </div>
      {checked ? (
        <Skeleton className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" >
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Box 4 Loading Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio placeat ipsa accusamus, autem nostrum minima labore sint. Cumque tempora eius voluptatibus harum? Adipisci iure maxime inventore eaque culpa vel at!
          </h1>
        </Skeleton> ) : (
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" >
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus corrupti molestiae magnam consequatur labore recusandae quidem eligendi assumenda quas commodi molestias suscipit similique vitae, hic ipsa laudantium, possimus voluptate natus.
          </h1>
        </div>)}
    </div>

  )
}
