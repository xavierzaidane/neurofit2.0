'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { Brain, Zap, Shield, Globe, Cpu, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

const features = [
  {
    icon: Brain,
    title: "SMART COACHING",
    description: "AI guidance that adapts to your goals and feedback.",
    colSpan: "md:col-span-2",
    bg: "bg-foreground",
    text: "text-black"
  },
  {
    icon: Zap,
    title: "FAST ADJUSTMENTS",
    description: "Plans update in seconds as your inputs change.",
    colSpan: "md:col-span-1",
    bg: "bg-white/5",
    text: "text-white"
  },
  {
    icon: Shield,
    title: "PRIVATE BY DESIGN",
    description: "Your health data stays protected and in your control.",
    colSpan: "md:col-span-1",
    bg: "bg-white/5",
    text: "text-white"
  },
  {
    icon: Globe,
    title: "HOLISTIC VIEW",
    description: "Training, nutrition, and recovery in one plan.",
    colSpan: "md:col-span-2",
    bg: "bg-white",
    text: "text-black"
  },
  {
    icon: Cpu,
    title: "SUSTAINABLE",
    description: "Progressive plans that keep you consistent.",
    colSpan: "md:col-span-3",
    bg: "bg-white/5",
    text: "text-white"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-24">
          <h2 className="font-display text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-8 leading-[0.85] tracking-tighter uppercase">
            Built For <br />
            <span className="text-foreground">Progress.</span>
          </h2>
          <div className="h-2 w-32 bg-foreground" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative p-8 md:p-12 rounded-3xl ${feature.colSpan} ${feature.bg} overflow-hidden transition-all duration-500 hover:scale-[1.02]`}
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight className={`w-8 h-8 ${feature.text}`} />
              </div>
              
              <div className="h-full flex flex-col justify-between relative z-10">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-8 ${feature.text === 'text-white' ? 'bg-white/10' : 'bg-black/10'}`}>
                  <feature.icon className={`w-8 h-8 ${feature.text}`} />
                </div>
                
                <div>
                  <h3 className={`font-display text-3xl md:text-4xl font-bold mb-4 ${feature.text} tracking-tight`}>
                    {feature.title}
                  </h3>
                  <p className={`text-lg md:text-xl font-medium leading-tight ${feature.text} opacity-70`}>
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}