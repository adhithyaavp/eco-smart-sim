
import { useState, useEffect } from 'react';

interface AnimatedValueOptions {
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
}

const defaultOptions: AnimatedValueOptions = {
  duration: 1000,
  delay: 0,
  easing: t => t,
};

const linear = (t: number) => t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export const easings = {
  linear,
  easeOutCubic,
  easeOutQuart,
};

export function useAnimatedValue(
  targetValue: number,
  startValue: number = 0,
  options: AnimatedValueOptions = {}
): number {
  const [value, setValue] = useState(startValue);
  const { duration, delay, easing } = { ...defaultOptions, ...options };

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    let currentValue = value;
    const totalChange = targetValue - currentValue;

    const animateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      if (elapsed < delay!) {
        animationFrame = requestAnimationFrame(animateValue);
        return;
      }
      
      const progress = Math.min((elapsed - delay!) / duration!, 1);
      const easedProgress = easing!(progress);
      
      currentValue = startValue + totalChange * easedProgress;
      setValue(currentValue);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateValue);
      }
    };
    
    animationFrame = requestAnimationFrame(animateValue);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [targetValue, startValue, duration, delay, easing]);
  
  return value;
}
