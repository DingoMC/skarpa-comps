'use client';

import { Input } from '@/lib/mui';
import { defaultStyle } from '@/lib/themes/react-select/select';
import { FaSearch } from 'react-icons/fa';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { TableHeaderInput } from '../types';

const animatedComponents = makeAnimated();

type Props = {
  input?: TableHeaderInput;
  value: string | null;
  onChange: (_: string | null) => void;
};

const HeaderFilter = ({ input, value, onChange }: Props) => {
  if (!input || input.type === 'input') {
    return (
      <Input
        size="sm"
        placeholder="Szukaj..."
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="rounded-none border-0 border-b border-gray-400 !text-xs !ring-0 !shadow-none !py-1"
        // containerProps={{ className: '!min-w-min !h-max !max-w-[120px] [&>div]:top-1 [&>div]:-translate-y-1' }}
      >
        <Input.Icon className="w-[10px] h-[10px]">
          <FaSearch className="w-[10px] h-[10px]" />
        </Input.Icon>
      </Input>
    );
  }
  return (
    <div className="text-left normal-case">
      <Select<{ label: string; value: string }>
        isClearable
        value={input.options.find((o) => o.value === value)}
        onChange={(v) => onChange(v?.value ?? null)}
        components={animatedComponents}
        options={input.options}
        placeholder="Wybierz..."
        noOptionsMessage={() => 'Brak opcji.'}
        styles={defaultStyle<{ label: string; value: string }>({ minWidth: '40px', menuHeight: '120px' })}
      />
    </div>
  );
};

export default HeaderFilter;
