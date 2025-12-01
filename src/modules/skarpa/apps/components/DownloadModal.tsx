'use client';

import { Button, Dialog, IconButton, Typography } from '@/lib/mui';
import { useEffect, useMemo, useState } from 'react';
import { IoMdClose, IoMdDownload } from 'react-icons/io';
import useDownloader from 'react-use-downloader';
import { Version } from '../types';
import AppVersion from './Version';

type Props = {
  name: string;
  appPrefix: string;
  version: Version;
};

const displayTime = (seconds: number) => {
  let s = seconds;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  if (h > 0) return `${h < 10 ? `0${h}` : `${h}`}:${m < 10 ? `0${m}` : `${m}`}:${s < 10 ? `0${s}` : `${s}`}`;
  return `${m < 10 ? `0${m}` : `${m}`}:${s < 10 ? `0${s}` : `${s}`}`;
};

const displaySize = (bytes: number) => {
  if (bytes > 1024 * 1024 * 1024) {
    const gbytes = (bytes * 1.0) / (1024.0 * 1024.0 * 1024.0);
    if (gbytes < 10) return `${gbytes.toFixed(2)} GB`;
    if (gbytes < 100) return `${gbytes.toFixed(1)} GB`;
    return `${gbytes.toFixed(0)} GB`;
  }
  if (bytes > 1024 * 1024) {
    const mbytes = (bytes * 1.0) / (1024.0 * 1024.0);
    if (mbytes < 10) return `${mbytes.toFixed(2)} MB`;
    if (mbytes < 100) return `${mbytes.toFixed(1)} MB`;
    return `${mbytes.toFixed(0)} MB`;
  }
  if (bytes > 1024) {
    const kbytes = (bytes * 1.0) / 1024.0;
    if (kbytes < 10) return `${kbytes.toFixed(2)} KB`;
    if (kbytes < 100) return `${kbytes.toFixed(1)} KB`;
    return `${kbytes.toFixed(0)} KB`;
  }
  return `${bytes.toFixed(0)} B`;
};

const DownloadAppModal = ({ appPrefix, version, name }: Props) => {
  const [open, setOpen] = useState(false);
  const filename = useMemo(() => `${appPrefix}-${version.versionType}-${version.version}.apk`, [appPrefix, version]);
  const { size, elapsed, percentage, download, cancel, error, isInProgress } = useDownloader();
  const [downloadingStarted, setDownloadingStarted] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    setDownloadingStarted(false);
    setDownloadSuccess(false);
  }, [open]);

  useEffect(() => {
    if (isInProgress) setDownloadingStarted(true);
  }, [isInProgress]);

  useEffect(() => {
    if (downloadingStarted && !isInProgress && !error) setDownloadSuccess(true);
  }, [downloadingStarted, isInProgress, error]);

  const onCancel = () => {
    cancel();
    setOpen(false);
  };

  const onDownload = async () => {
    download(`/apps/${filename}`, filename);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger as={Button} variant="gradient" size="sm" color="primary" className="w-max mb-3" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-1">
          <IoMdDownload className="w-4 h-4" />
          <Typography>Pobierz</Typography>
        </div>
      </Dialog.Trigger>
      <Dialog.Overlay>
        <Dialog.Content>
          <div className="flex items-center justify-between gap-4">
            <Typography type="h6">Pobierz {name}</Typography>
            <Dialog.DismissTrigger
              as={IconButton}
              size="sm"
              variant="ghost"
              color="secondary"
              className="absolute right-2 top-2"
              disabled={isInProgress}
              isCircular
            >
              <IoMdClose className="h-5 w-5" />
            </Dialog.DismissTrigger>
          </div>
          <div className="grid grid-cols-2 text-gray-800">
            <div>Nazwa pliku:</div>
            <div>{filename}</div>
            <div>Typ pliku:</div>
            <div>Aplikacja Android (.apk)</div>
            <div>Wersja Apikacji:</div>
            <AppVersion version={version} variant="text" classes="!text-base" />
            <div>Status pobierania:</div>
            <div>
              {displaySize((size * percentage) / 100.0)} / {displaySize(size)} ({percentage}%)
            </div>
            <div>Czas pobierania:</div>
            <div>{displayTime(elapsed)}</div>
            {error && error.errorMessage && (
              <>
                <div>Błąd pobierania:</div>
                <div>{error.errorMessage}</div>
              </>
            )}
          </div>
          {isInProgress && <div className="animate-pulse text-green-900 font-semibold mt-2">Trwa pobieranie...</div>}
          {downloadSuccess && <div className="text-green-900 font-semibold mt-2">Plik został pobrany pomyślnie.</div>}
          <div className="mb-1 flex items-center justify-end gap-2">
            <Button onClick={onCancel} disabled={isInProgress} color="secondary">
              {isInProgress ? 'Anuluj' : 'Zamknij'}
            </Button>
            <Button onClick={onDownload} disabled={isInProgress}>
              Start
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog>
  );
};

export default DownloadAppModal;
