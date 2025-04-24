
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface AnimatedValueProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

export const AnimatedValue: React.FC<AnimatedValueProps> = ({
  value,
  suffix = '',
  prefix = '',
  duration = 1000,
  className,
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    const startTime = performance.now();
    const endTime = startTime + duration;
    
    const updateValue = (currentTime: number) => {
      if (currentTime >= endTime) {
        setDisplayValue(endValue);
        return;
      }
      
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;
      const currentValue = startValue + (endValue - startValue) * progress;
      
      setDisplayValue(currentValue);
      requestAnimationFrame(updateValue);
    };
    
    requestAnimationFrame(updateValue);
  }, [value, duration]);
  
  return (
    <span className={cn('', className)}>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
};

export default AnimatedValue;
