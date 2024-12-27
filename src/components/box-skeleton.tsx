import React from 'react'
import { Skeleton } from './ui/skeleton'

const BoxSkeleton = () => {
    return (
        <>
            <Skeleton className="aspect-video rounded-xl bg-muted/50 text-center">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Box 1 Loading
                </h1>
            </Skeleton>
            <Skeleton className="aspect-video rounded-xl bg-muted/50 text-center" >
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Box 2 Loading
                </h1>
            </Skeleton>
            <Skeleton className="aspect-video rounded-xl bg-muted/50 text-center" >
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Box 3 Loading
                </h1>
            </Skeleton>
        </>

    )
}

export { BoxSkeleton } 