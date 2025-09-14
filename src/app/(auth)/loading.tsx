'use client';

import SkarpaLoader from '@/modules/loaders/components/Loader';

export default function Loading() {
  return (
    <div className="flex flex-col gap-y-4 items-center justify-center w-full h-full">
      <SkarpaLoader size="lg" color="white" />
      <div className="text-sm text-white">Ładowanie strony... Proszę czekać...</div>
    </div>
  );
}
