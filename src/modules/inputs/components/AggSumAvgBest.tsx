'use client';

import { Tabs } from '@/lib/mui';

type Props = {
  value: 'sum' | 'avg' | 'best';
  disabled?: boolean;
  onChange: (_: 'sum' | 'avg' | 'best') => void;
};

const indicatorClassName = (value: 'sum' | 'avg' | 'best') => {
  if (value === 'sum') return 'bg-green-600';
  if (value === 'avg') return 'bg-blue-500';
  return 'bg-amber-600';
};

const AggSumAvgBest = ({ value, disabled, onChange }: Props) => (
  <Tabs className="w-[250px]" defaultValue={value}>
    <Tabs.List className="bg-gray-300 w-full">
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'sum' ? 'text-white' : 'text-gray-500'}`}
        value="sum"
        onClick={() => onChange('sum')}
      >
        Suma
      </Tabs.Trigger>
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'avg' ? 'text-white' : 'text-gray-500'}`}
        value="avg"
        onClick={() => onChange('avg')}
      >
        Średnia
      </Tabs.Trigger>
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'best' ? 'text-white' : 'text-gray-500'}`}
        value="best"
        onClick={() => onChange('best')}
      >
        Najlepszy
      </Tabs.Trigger>
      <Tabs.TriggerIndicator className={`${indicatorClassName(value)} shadow-none`} />
    </Tabs.List>
  </Tabs>
);

export default AggSumAvgBest;
