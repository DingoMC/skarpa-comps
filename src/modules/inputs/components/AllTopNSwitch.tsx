'use client';

import { Tabs } from '@/lib/mui';

type Props = {
  value: 'all' | 'topN';
  disabled?: boolean;
  onChange: (_: 'all' | 'topN') => void;
};

const AllTopNSwitch = ({ value, disabled, onChange }: Props) => (
  <Tabs className="w-[250px]" defaultValue={value}>
    <Tabs.List className="bg-gray-300 w-full">
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'topN' ? 'text-gray-500' : 'text-white'}`}
        value="all"
        onClick={() => onChange('all')}
      >
        Wszystkich
      </Tabs.Trigger>
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value === 'topN' ? 'text-white' : 'text-gray-500'}`}
        value="topN"
        onClick={() => onChange('topN')}
      >
        N-najlepszych
      </Tabs.Trigger>
      <Tabs.TriggerIndicator className={`${value === 'all' ? 'bg-blue-500' : 'bg-amber-600'} shadow-none`} />
    </Tabs.List>
  </Tabs>
);

export default AllTopNSwitch;
