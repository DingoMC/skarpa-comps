'use client';

import { Progress } from '@/lib/mui';

type SkarpaProgressProps = {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'gradient';
  className?: string;
  barClassName?: string;
};

const SkarpaProgress = ({ value, size, variant, className, barClassName }: SkarpaProgressProps) => {
  const defaultClassName = () => {
    if (variant === 'gradient') return 'from-main/90 to-main';
    return 'bg-main';
  };

  return (
    <Progress size={size} value={value} className={className ?? ''}>
      <Progress.Bar className={`transition-width ease-in-out duration-500 ${defaultClassName()} ${barClassName}`} />
    </Progress>
  );
};

export default SkarpaProgress;
