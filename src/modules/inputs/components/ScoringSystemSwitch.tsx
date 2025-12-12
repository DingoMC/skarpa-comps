'use client';

import { Tabs } from '@/lib/mui';
import { TaskScoringSystem } from '@/lib/types/task';

type Props = {
  value: TaskScoringSystem;
  disabled?: boolean;
  onChange: (_: TaskScoringSystem) => void;
};

const indicatorClassName = (value: TaskScoringSystem) => {
  if (value === 'normal') return 'bg-green-600';
  if (value === 'linear') return 'bg-blue-500';
  if (value === 'multilinear') return 'bg-indigo-500';
  if (value === 'ranges') return 'bg-purple-600';
  if (value === 'zones') return 'bg-pink-600';
  return 'bg-red-600';
};

const ScoringSystemSwitch = ({ value, disabled, onChange }: Props) => (
  <Tabs defaultValue={value}>
    <Tabs.List className="bg-gray-300 w-full">
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'normal' ? 'text-white' : 'text-gray-500'}`}
        value="normal"
        onClick={() => onChange('normal')}
      >
        1:1
      </Tabs.Trigger>
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'zones' ? 'text-white' : 'text-gray-500'}`}
        value="zones"
        onClick={() => onChange('zones')}
      >
        Strefy
      </Tabs.Trigger>
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
        className={`w-full cursor-pointer transition-colors ${value === 'time' ? 'text-white' : 'text-gray-500'}`}
        value="time"
        onClick={() => onChange('time')}
      >
        Czas
      </Tabs.Trigger>
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'linear' ? 'text-white' : 'text-gray-500'}`}
        value="linear"
        onClick={() => onChange('linear')}
      >
        Liniowy
      </Tabs.Trigger>
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'multilinear' ? 'text-white' : 'text-gray-500'}`}
        value="multilinear"
        onClick={() => onChange('multilinear')}
      >
        Wieloliniowy
      </Tabs.Trigger>
      <Tabs.TriggerIndicator className={`${indicatorClassName(value)} shadow-none`} />
    </Tabs.List>
  </Tabs>
);

export default ScoringSystemSwitch;
