import * as Lucide from "lucide-react";
import React from "react";

export type IconName = keyof typeof Lucide;

interface IconProps extends Omit<React.ComponentPropsWithoutRef<"svg">, "value"> {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = "", size = 20, ...props }) => {
  // Safe lookup with fallback
  const LucideIcon = (Lucide as any)[name] || Lucide.HelpCircle;
  return <LucideIcon className={className} size={size} {...props} />;
};

export default Icon;
