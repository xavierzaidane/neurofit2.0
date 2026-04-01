import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";

const NoFitnessPlan = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative backdrop-blur-md border border-white/10 bg-white/5 rounded-3xl p-12 md:p-16 text-center overflow-hidden group hover:bg-white/8 transition-all duration-500"
    >

      <h2 className="text-3xl md:text-5xl font-mono mb-6 font-display tracking-tighter text-white">
        <span className="text-foreground">No</span> Fitness Plans Yet
      </h2>
      <p className="text-white/60 mb-10 max-w-md mx-auto text-lg leading-relaxed">
        Start by creating a personalized fitness and diet plan tailored to your specific goals and
        needs
      </p>
      <Link href="/program">
        <button className="group relative inline-flex items-center gap-2 bg-foreground text-black px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 uppercase tracking-wider ">
          Create Your First Plan
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </motion.div>
  );
};
export default NoFitnessPlan;