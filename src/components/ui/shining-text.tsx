"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface ShiningTextProps {
  text: string
  className?: string
  duration?: number
}

export function ShiningText({ text, className, duration = 2 }: ShiningTextProps) {
  return (
    <motion.span
      className={`bg-[linear-gradient(110deg,#737373,35%,#fff,50%,#737373,75%,#737373)] bg-[length:200%_100%] bg-clip-text text-sm font-medium text-transparent ${className ?? ""}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
    >
      {text}
    </motion.span>
  )
}
