import React from "react";
import { Skeleton } from "./ui/skeleton";

const BoxSkeleton = () => {
  return (
    <>
      <Skeleton className="aspect-video rounded-xl bg-muted/50 text-center">
        <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Box 1 Loading
        </h1>
      </Skeleton>
      <Skeleton className="aspect-video rounded-xl bg-muted/50 text-center">
        <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Box 2 Loading
        </h1>
      </Skeleton>
      <Skeleton className="aspect-video rounded-xl bg-muted/50 text-center">
        <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Box 3 Loading 
          aespa ,le serrafim ,ive, illit, newjeans,xg, gidle, griend ,babymonster,izone,fromis_9 , red velvet, 
        </h1>
      </Skeleton>
    </>
  );
};

export { BoxSkeleton };
