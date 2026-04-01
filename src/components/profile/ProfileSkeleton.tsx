"use client";

import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => (
  <div className="space-y-12">
    <div className="relative backdrop-blur-md border border-white/10 bg-white/5 rounded-lg p-3 md:p-7 overflow-hidden -mt-10">
      <div className="flex items-start justify-between mb-9">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="flex flex-wrap gap-3 -mt-2">
        <Skeleton className="px-3 py-2 rounded-lg w-24 h-8" />
        <Skeleton className="px-3 py-2 rounded-lg w-32 h-8" />
        <Skeleton className="px-3 py-2 rounded-lg w-28 h-8" />
      </div>
    </div>

    <div className="relative border border-white/10 bg-white/5 rounded-lg p-6 md:p-8 overflow-hidden">
      <Skeleton className="h-6 w-40 mb-6" />

      <div className="space-y-4">
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
