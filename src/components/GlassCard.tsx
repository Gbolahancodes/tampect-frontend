import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GlassCard({ children, className, onClick }: { children: ReactNode, className?: string, onClick?: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-2xl p-6 text-white",
        onClick && "cursor-pointer hover:bg-white/10 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}