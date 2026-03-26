import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PresetButtonProps {
  name: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export function PresetButton({ name, icon, isActive, onClick }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 group overflow-hidden",
        isActive 
          ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(0,243,255,0.2)]" 
          : "bg-card border-white/5 hover:border-primary/50 hover:bg-card/80"
      )}
    >
      {/* Background glow effect for active state */}
      {isActive && (
        <motion.div 
          layoutId="activePreset"
          className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-50"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      <div className={cn(
        "p-3 rounded-full transition-colors duration-300 relative z-10",
        isActive ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,243,255,0.6)]" : "bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
      )}>
        {icon}
      </div>
      
      <span className={cn(
        "font-display text-xs tracking-widest relative z-10",
        isActive ? "text-primary font-bold text-glow" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {name}
      </span>
    </button>
  );
}
