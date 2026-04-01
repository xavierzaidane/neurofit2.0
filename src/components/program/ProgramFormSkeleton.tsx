"use client";

import { Skeleton } from "@/components/ui/skeleton";

const ProgramFormSkeleton = () => (
  <div className="space-y-7">
    <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
      <Skeleton className="h-9 w-full rounded-md bg-white/10" />
      <Skeleton className="h-9 w-full rounded-md bg-white/10" />
      <Skeleton className="h-9 w-full rounded-md bg-white/10" />
      <Skeleton className="h-9 w-full rounded-md bg-white/10" />
    </div>

    <div className="relative border border-white/10 bg-white/5 rounded-lg p-6 md:p-8 overflow-hidden space-y-4">
      <Skeleton className="h-5 w-32 rounded-md bg-white/10" />
      <Skeleton className="h-4 w-48 rounded-md bg-white/10" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Skeleton className="h-10 w-full rounded-lg bg-white/10" />
        <Skeleton className="h-10 w-full rounded-lg bg-white/10" />
        <Skeleton className="h-10 w-full rounded-lg bg-white/10" />
        <Skeleton className="h-10 w-full rounded-lg bg-white/10" />
        <Skeleton className="h-10 w-full rounded-lg bg-white/10 md:col-span-2" />
        <Skeleton className="h-24 w-full rounded-lg bg-white/10 md:col-span-2" />
      </div>
    </div>
  </div>
);

export default ProgramFormSkeleton;
