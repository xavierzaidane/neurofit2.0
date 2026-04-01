'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight} from 'lucide-react';
import { useRef } from 'react';
import Link from 'next/link';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">

        <iframe 
          src='https://my.spline.design/nexbotrobotcharacterconcept-Fbwklr6dx2hXZoHZNSUZ6XD1/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="w-full h-full scale-125 md:scale-100 origin-center object-cover"
          title="3D Robot Character"
        ></iframe>
      </motion.div>

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/80 md:via-black/50 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-end md:items-center px-6 md:px-20 pb-24 md:pb-0 pt-20">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 mb-4 md:mb-6 text-[10px] md:text-xs font-medium tracking-wider text-foreground uppercase border border-foreground/30 rounded-full bg-foreground/10 backdrop-blur-sm">
              Fitness AI Planner
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-4 md:mb-6 leading-[0.95] md:leading-[0.9]"
          >
            FITNESS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
              REIMAGINED.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-xl text-white/70 md:text-white/60 mb-8 md:mb-10 max-w-lg leading-relaxed"
          >
            Meet Neurofit2.0, your AI training partner that builds adaptive workouts, nutrition targets, and recovery plans tailored to your goals.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
             <Link href={"/program"} >
            <button className="group flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-foreground hover:text-white transition-all hover:scale-105 active:scale-95 duration-300 w-full sm:w-auto">
              Build My Plan
              
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              
            </button>
            </Link>
            <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-lg text-white border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm w-full sm:w-auto">
              See How It Works
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 hidden md:flex"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/40">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}