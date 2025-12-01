'use client';

import { Tabs, Typography } from '@/lib/mui';
import { useState } from 'react';
import appDataRaw from '../../../../../public/apps/metadata.json';
import { MobileApp } from '../types';
import SingleApp from './Single';

const AppsPage = () => {
  const appData = appDataRaw as MobileApp[];
  const [selectedApp, setSelectedApp] = useState(appData[0].appCode);

  return (
    <div>
      <Typography className="text-sm text-gray-600 mb-1">Wybierz aplikację:</Typography>
      <Tabs className="w-full" defaultValue={appData[0].appCode}>
        <Tabs.List className="bg-gray-300 w-full">
          {appData.map((app) => (
            <Tabs.Trigger
              key={app.appCode}
              className={`w-full cursor-pointer transition-colors ${selectedApp === app.appCode ? 'text-white' : 'text-gray-500'}`}
              value={app.appCode}
              onClick={() => setSelectedApp(app.appCode)}
            >
              {app.name}
            </Tabs.Trigger>
          ))}
          <Tabs.TriggerIndicator className={`bg-blue-600 shadow-none`} />
        </Tabs.List>
        {appData.map((app) => (
          <Tabs.Panel key={app.appCode} value={app.appCode}>
            <SingleApp app={app} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};

export default AppsPage;
