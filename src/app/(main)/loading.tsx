'use client';

import SkarpaLoader from '@/modules/loaders/components/Loader';

export default function Loading() {
  return (
    <div className="flex flex-col gap-y-4 items-center justify-center w-full h-full">
      <SkarpaLoader size="lg" color="red" />
      <div className="text-sm text-gray-900">Ładowanie strony... Proszę czekać...</div>
    </div>
  );
}
