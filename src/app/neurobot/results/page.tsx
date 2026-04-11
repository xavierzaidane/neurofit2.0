'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb';
import { ResultsSkeleton } from '@/components/neurobot/booking/ResultsSkeleton';
import { gyms } from '@/data/gym';
import type { Gym } from '@/types/gym';
import { GymGrid } from '@/components/neurobot/GymGrid';

export default function GymResultsPage() {
  const router = useRouter();
  const [liveGyms, setLiveGyms] = useState<Gym[]>(gyms);
  const [isLoadingLiveGyms, setIsLoadingLiveGyms] = useState(false);

  useEffect(() => {
    const fetchDefaultGyms = () => {
      setLiveGyms(gyms);
    };

    fetchDefaultGyms();
  }, []);

  const handleGymClick = (gym: Gym) => {
    router.push(`/neurobot/results/${gym.id}`);
  };

  return (
    <section className="relative z-10 pt-20 pb-32 flex-grow">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/neurobot">Location</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Results</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>
      
      <Suspense fallback={<ResultsSkeleton />}>
        <div className="w-full">
          {isLoadingLiveGyms ? (
            <ResultsSkeleton />
          ) : (
            <GymGrid gyms={liveGyms} onContactClick={handleGymClick} />
          )}
        </div>
      </Suspense>
    </section>
  );
}
