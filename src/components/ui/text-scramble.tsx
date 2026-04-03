'use client';
import { type JSX, useEffect, useRef, useState } from 'react';
import { motion, MotionProps } from 'motion/react';

export type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  loop?: boolean;
  loopDelay?: number;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = 'p',
  trigger = true,
  loop = false,
  loopDelay = 800,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements
  );
  const [displayText, setDisplayText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const text = children;

  const scramble = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const steps = duration / speed;
    let step = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      let scrambled = '';
      const progress = step / steps;

      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
          continue;
        }

        if (progress * text.length > i) {
          scrambled += text[i];
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);
      step++;

      if (step > steps) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayText(text);
        setIsAnimating(false);
        onScrambleComplete?.();

        if (loop) {
          loopTimeoutRef.current = setTimeout(() => {
            scramble();
          }, loopDelay);
        }
      }
    }, speed * 1000);
  };

  useEffect(() => {
    if (!trigger) return;

    scramble();
  }, [trigger]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, []);

  return (
    <MotionComponent className={className} {...props}>
      {displayText}
    </MotionComponent>
  );
}
