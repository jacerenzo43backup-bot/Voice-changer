import React from 'react';
import { cn } from '@/lib/utils';

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (val: number) => string;
  icon?: React.ReactNode;
}

export function ControlSlider({ 
  label, 
  value, 
  min, 
  max, 
  step = 0.01, 
  onChange,
  formatValue = (v) => v.toFixed(2),
  icon
}: ControlSliderProps) {
  return (
    <div className="w-full space-y-3 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          {icon && <span className="text-primary/70">{icon}</span>}
          <span className="tracking-widest uppercase">{label}</span>
        </div>
        <div className="font-display font-bold text-primary text-glow text-sm">
          {formatValue(value)}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        {/* Glow behind the track based on value */}
        <div 
          className="absolute inset-0 h-2 bg-primary/20 rounded-full pointer-events-none blur-sm transition-all duration-200"
          style={{ 
            width: `${((value - min) / (max - min)) * 100}%`,
            opacity: value > min ? 1 : 0
          }}
        />
      </div>
    </div>
  );
}
