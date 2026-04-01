'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function NeurobotSkeleton() {
  return (
    <section className="relative z-10 pt-20 pb-32 flex-grow">
      <div className="max-w-5xl container mx-auto px-4 md:px-6 mb-12">
        <div className="text-left pt-10">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-5 w-96 mb-8" />
        </div>
        
        <div className="relative backdrop-blur-md border border-white/10 bg-white/5 rounded-lg p-3 md:p-7 overflow-hidden mt-10">
          <div className="mb-6 flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          <div className="space-y-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          <div className="flex gap-3 mt-8">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </section>
  );
}
