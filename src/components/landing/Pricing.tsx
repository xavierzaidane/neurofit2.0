'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { Check, Zap } from 'lucide-react';
import { useRef } from 'react';

const plans = [
  {
    name: "STARTER",
    price: "$0",
    features: ["BASIC WORKOUT PLAN", "WEEKLY CHECK-INS", "COMMUNITY ACCESS"],
    highlight: false
  },
  {
    name: "PRO",
    price: "$49",
    features: ["ADAPTIVE TRAINING", "NUTRITION TARGETS", "RECOVERY GUIDANCE", "PRIORITY SUPPORT"],
    highlight: true
  },
  {
    name: "TEAM",
    price: "CUSTOM",
    features: ["COACH DASHBOARD", "ATHLETE PROFILES", "TEAM INSIGHTS", "CUSTOM ONBOARDING"],
    highlight: false
  }
];

export default function Pricing() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section ref={ref} id="pricing" className="py-32 bg-black relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div style={{ y }} className="mb-24 text-center">
          <h2 className="font-display text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter">
            Choose Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground">Fitness Plan.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 md:p-12 rounded-3xl border-2 flex flex-col transition-transform duration-500 hover:scale-105 ${
                plan.highlight 
                  ? 'bg-foreground border-foreground text-black scale-105 z-10 shadow-[0_0_50px_rgba(249,115,22,0.3)]' 
                  : 'bg-black border-white/20 text-white hover:border-white'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-foreground px-6 py-2 rounded-full font-bold uppercase tracking-widest border border-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-foreground" />
                  Most Popular
                </div>
              )}

              <div className="mb-10">
                <h3 className="font-display text-xl md:text-2xl font-bold mb-4 tracking-widest">{plan.name}</h3>
                <div className="text-4xl md:text-6xl font-bold tracking-tighter">{plan.price}</div>
              </div>

              <div className="flex-grow mb-12">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold tracking-wide text-sm">
                      <Check className={`w-5 h-5 ${plan.highlight ? 'text-black' : 'text-foreground'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className={`w-full py-5 rounded-xl font-bold text-lg uppercase tracking-widest transition-all duration-300 ${
                  plan.highlight 
                    ? 'bg-black text-white hover:bg-white hover:text-black' 
                    : 'bg-white text-black hover:bg-foreground hover:text-white'
                }`}
              >
                Start Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}