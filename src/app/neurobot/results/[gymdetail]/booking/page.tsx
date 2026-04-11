'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { useForm } from '@tanstack/react-form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { GymBookingSkeleton } from '@/components/neurobot/booking/GymBookingSkeleton';
import { gyms } from '@/data/gym';
import GymDetailTabs from '@/components/neurobot/booking/GymBookingFormTabs';


export default function GymBookingPage() {
  const params = useParams();
  const gymId = params.gymdetail as string;
  const gym = gyms.find((g) => g.id === gymId);

  const form = useForm({
    defaultValues: {
      bookingName: '',
      bookingEmail: '',
      bookingPhone: '',
      membershipType: '',
      duration: '',
      startDate: '',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Booking submitted:', value);
      alert('Booking submitted. We will contact you soon!');
    },
  });

  const inputClassName =
    "w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-mono text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20";

  if (!gym) {
    return (
      <section className="relative z-10 pt-20 pb-32 flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/60">Gym not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 pt-20 pb-32 flex-grow">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/neurobot/results">Results</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/neurobot/results/${gymId}`}>{gym.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Booking</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Suspense fallback={<GymBookingSkeleton />}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white font-mono mb-2">Book {gym.name}</h1>
            <p className="text-white/70 font-mono text-sm">Complete your membership booking below</p>
          </div>

          <GymDetailTabs gym={gym} form={form} inputClassName={inputClassName} />
        </motion.div>
      </Suspense>
    </section>
  );
}
