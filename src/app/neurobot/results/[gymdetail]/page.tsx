'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Star, MapPin, Phone, Clock, DollarSign, Dumbbell, ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../../components/ui/breadcrumb';
import { GymBookingSkeleton } from '@/components/neurobot/booking/GymBookingSkeleton';
import { gyms } from '@/data/gym';
import Image from 'next/image';
import type { Gym } from '@/types/gym';

export default function GymDetailPage() {
  const params = useParams();
  const gymId = params.gymdetail as string;

  const gym = gyms.find((g) => g.id === gymId);

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/neurobot/results">Results</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{gym.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Suspense fallback={<GymBookingSkeleton />}>
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8" >
     

          <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white font-mono mb-2">{gym.name}</h1>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-4 h-4" />
                <span className="font-mono text-sm">{gym.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-5 h-5 fill-foreground text-foreground" />
                  <span className="text-2xl font-bold text-white font-mono">{gym.rating}</span>
                </div>
                <p className="text-xs text-white/60 font-mono">({gym.reviewCount} reviews)</p>
              </div>
            </div>
          </div>

             <div className="relative aspect-video overflow-hidden mb-6">
          {gym.images && gym.images.length > 0 && (
            <Image
              src={gym.images[0]}
              alt={gym.name}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              priority
            />
          )}
        </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 -mb-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/60 font-mono uppercase">Price</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">${gym.price}/mo</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Dumbbell className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/60 font-mono uppercase">Type</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">{gym.type}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/60 font-mono uppercase">Hours</span>
              </div>
              <p className="text-lg font-mono text-white/80">{gym.hours}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/60 font-mono uppercase">Contact</span>
              </div>
              <p className="text-lg font-mono text-white/80">{gym.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4"
      >
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-mono font-semibold text-white mb-4">About</h2>
          <p className="text-white/80 leading-relaxed">{gym.description}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-mono font-semibold text-white mb-4">Amenities</h2>
          <div className="space-y-2">
            {gym.amenities?.map((amenity, idx) => (
              <p key={idx} className="text-sm text-white/80 font-mono">
                -{amenity}
              </p>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-mono font-semibold text-white mb-4">Contact</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <span className="text-sm text-white/70 font-mono w-32">Phone:</span>
              <a href={`tel:${gym.phone}`} className="text-white hover:text-white/80 font-mono text-sm">
                {gym.phone}
              </a>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-sm text-white/70 font-mono w-32">Website:</span>
              <a
                href={`https://${gym.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-mono text-sm"
              >
                {gym.website}
              </a>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-sm text-white/70 font-mono w-32">Hours:</span>
              <span className="text-white font-mono text-sm">{gym.hours}</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-sm text-white/70 font-mono w-32">Address:</span>
              <span className="text-white font-mono text-sm">{gym.address}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex justify-end"
      >
        <Link
          href={`/neurobot/results/${gymId}/booking`}
          className="flex items-center gap-2 px-6 py-3 text-sm font-mono text-black hover:text-white bg-white rounded-lg hover:bg-foreground transition-colors font-semibold"
        >
          Book Now
          <ChevronRight className="h-4 w-4" />
        </Link>
      </motion.div>
      </Suspense>
    </section>
  );
}
