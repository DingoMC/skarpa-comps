'use client';

import { Typography } from '@/lib/mui';
import { VERSION_NAMES } from '../constants';
import { MobileApp } from '../types';
import AppBug from './Bug';
import AppBugFixed from './BugFixed';
import AppBugFromTo from './BugFromTo';
import ChangelogIcon from './ChangelogIcon';
import ChangelogSingle from './ChangelogSingle';
import DownloadAppModal from './DownloadModal';
import AppVersion from './Version';

type Props = {
  app: MobileApp;
};

const SingleApp = ({ app }: Props) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-x-4 w-full justify-center items-center pb-3 mb-3 border-b border-gray-400">
        <Typography type="h5">{app.name}</Typography>
        <AppVersion version={{ version: app.version, versionType: app.versionType }} variant="badge" />
      </div>
      <DownloadAppModal name={app.name} version={{ version: app.version, versionType: app.versionType }} appPrefix={app.appPrefix} />
      <Typography type="h6">Opis</Typography>
      <div className="mb-3">{app.description}</div>
      <Typography type="h6">Informacje dotyczące instalacji</Typography>
      <div className="mb-3">
        Pobierana aplikacja jest plikiem wykonywalnym. System w telefonie może potraktować go jako zagrożenie bezpieczeństwa, ponieważ nie
        pochodzi on ze znanego źródła (takim jak np. Sklep Play). Po pobraniu pliku należy zaakceptować pobieranie z nieznanych źródeł. W
        przypadku większości przeglądarek pojawią się odpowiednie komunikaty umożliwiając instalację krok po kroku.
      </div>
      {app.versionType !== 'release' && (
        <div className="flex flex-wrap items-center gap-1 mb-4">
          <div
            className={`flex items-center justify-center text-sm border rounded-md px-2 py-px cursor-pointer 
              w-fit border-yellow-900 bg-yellow-50 text-yellow-800`}
          >
            Uwaga
          </div>
          <div className="text-sm text-amber-900">
            Aplikacja jest w wersji {VERSION_NAMES[app.versionType]}. Może zawierać niezarejestrowane błędy w zależności od urządzenia na
            którym są uruchamiane. Wszelkie błędy należy zgłaszać do administratora.
          </div>
        </div>
      )}
      <Typography type="h6" className="mb-1">
        Wykaz błędów
      </Typography>
      <div className="flex flex-col gap-y-2 mb-4">
        {app.buglist.toReversed().map((bug) => (
          <div key={bug.id} className="flex flex-col md:flex-row gap-2 md:items-center">
            <div className="flex gap-2 items-center">
              <AppBug variant="badge" bugId={bug.id} appCode={app.appCode} />
              {bug.fixed && <AppBugFixed variant="badge" />}
            </div>
            <AppBugFromTo bug={bug} appCode={app.appCode} />
            <div className="text-sm hidden md:block">-</div>
            <div className="text-sm">{bug.description}</div>
          </div>
        ))}
      </div>
      <Typography type="h6" className="mb-1">
        Wykaz zmian
      </Typography>
      <div className="flex flex-col gap-y-2 mb-4">
        {app.changelog.toReversed().map((cl) => (
          <div key={cl.version} className="flex flex-col gap-y-1 mb-2">
            <div id={`${app.appCode.toLowerCase()}-${cl.versionType}-${cl.version}`} className="mb-1">
              <AppVersion version={cl} variant="badge" />
            </div>
            {cl.log.map((log, i) => (
              <div className="flex gap-x-1 items-center" key={i}>
                <div className="ml-2">
                  <ChangelogIcon type={log.type} />
                </div>
                <div className="flex flex-wrap gap-x-1 items-center text-sm">
                  <ChangelogSingle log={log.content} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleApp;
