'use client';

import { Tabs } from '@/lib/mui';
import { TaskTimeTransformType } from '@/lib/types/task';

type Props = {
  value: TaskTimeTransformType;
  disabled?: boolean;
  onChange: (_: TaskTimeTransformType) => void;
};

const indicatorClassName = (value: TaskTimeTransformType) => {
  if (value === 'linear') return 'bg-blue-500';
  if (value === 'multilinear') return 'bg-indigo-500';
  if (value === 'hyperbolic') return 'bg-indigo-800';
  return 'bg-purple-600';
};

const TimeSystemSwitch = ({ value, disabled, onChange }: Props) => (
  <Tabs defaultValue={value}>
    <Tabs.List className="bg-gray-300 w-full">
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'ranges' ? 'text-white' : 'text-gray-500'}`}
        value="ranges"
        onClick={() => onChange('ranges')}
      >
        Przedziały
      </Tabs.Trigger>
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'linear' ? 'text-white' : 'text-gray-500'}`}
        value="linear"
        onClick={() => onChange('linear')}
      >
        Liniowa
      </Tabs.Trigger>
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'multilinear' ? 'text-white' : 'text-gray-500'}`}
        value="multilinear"
        onClick={() => onChange('multilinear')}
      >
        Wieloliniowa
      </Tabs.Trigger>
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'hyperbolic' ? 'text-white' : 'text-gray-500'}`}
        value="hyperbolic"
        onClick={() => onChange('hyperbolic')}
      >
        Hiperboliczna
      </Tabs.Trigger>
      <Tabs.TriggerIndicator className={`${indicatorClassName(value)} shadow-none`} />
    </Tabs.List>
  </Tabs>
);

export default TimeSystemSwitch;
