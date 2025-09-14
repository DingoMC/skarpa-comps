'use client';

import { Tabs } from '@/lib/mui';

type Props = {
  value: boolean;
  disabled?: boolean;
  onChange: (_: boolean) => void;
};

const GenderSwitch = ({ value, disabled, onChange }: Props) => (
  <Tabs className="w-[200px]" defaultValue={value ? 'm' : 'k'}>
    <Tabs.List className="bg-gray-300 w-full">
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value ? 'text-gray-500' : 'text-white'}`}
        value="k"
        onClick={() => onChange(false)}
      >
        Kobieta
      </Tabs.Trigger>
      <Tabs.Trigger
        disabled={disabled}
        className={`w-full cursor-pointer transition-colors ${value ? 'text-white' : 'text-gray-500'}`}
        value="m"
        onClick={() => onChange(true)}
      >
        Mężczyzna
      </Tabs.Trigger>
      <Tabs.TriggerIndicator className={`${value ? 'bg-blue-500' : 'bg-pink-500'} shadow-none`} />
    </Tabs.List>
  </Tabs>
);

export default GenderSwitch;
