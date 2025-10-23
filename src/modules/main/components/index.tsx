'use client';

import RichTextEditor from '@/modules/inputs/components/RichText';
import RichTextViewer from '@/modules/inputs/components/RichTextViewer';
import { useEffect, useState } from 'react';

const MainPage = () => {
  const [value, setValue] = useState<string>('{}');

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div className="flex flex-col gap-4">
      <RichTextEditor value={value} onChange={(v) => setValue(v)} />
      <RichTextViewer value={value} />
    </div>
  );
};

export default MainPage;
