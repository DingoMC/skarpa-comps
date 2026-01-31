'use client';

import { Button, Dialog, IconButton, Typography } from '@/lib/mui';
import TemplateButton from '@/modules/buttons/TemplateButton';
import Link from 'next/link';
import QRCode from 'qrcode';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

type Props = {
  loading: boolean;
  compId: string;
};

const APP_URL = process.env.NEXT_PUBLIC_APPLICATION_URL ?? 'https://skarpa.dingo-mc.net';

const QRCodesDialog = ({ loading, compId }: Props) => {
  const [open, setOpen] = useState(false);
  const [enrollUrl, setEnrollUrl] = useState<string | null>(null);
  const [listUrl, setListUrl] = useState<string | null>(null);
  const [resultsUrl, setResultsUrl] = useState<string | null>(null);

  const handleEnrollQR = () => {
    const data = `${APP_URL}/comp_signups?id=${compId}`;
    QRCode.toDataURL(data, { width: 480 }, (err, url) => {
      if (err) return;
      setEnrollUrl(url);
    });
  };

  const handleListQR = () => {
    const data = `${APP_URL}/comp_list?id=${compId}`;
    QRCode.toDataURL(data, { width: 480 }, (err, url) => {
      if (err) return;
      setListUrl(url);
    });
  };

  const handleResultsQR = () => {
    const data = `${APP_URL}/results?id=${compId}`;
    QRCode.toDataURL(data, { width: 480 }, (err, url) => {
      if (err) return;
      setResultsUrl(url);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TemplateButton template="qr" disabled={loading} onClick={() => setOpen(true)} />
      <Dialog.Overlay>
        <Dialog.Content>
          <div className="flex items-center justify-between gap-2">
            <Typography type="h6">Kody QR</Typography>
            <Dialog.DismissTrigger
              as={IconButton}
              size="sm"
              variant="ghost"
              color="secondary"
              className="absolute right-2 top-2"
              disabled={loading}
              isCircular
            >
              <IoMdClose className="h-5 w-5" />
            </Dialog.DismissTrigger>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2 items-center">
              <Typography type="p">Do zapisów:</Typography>
              <Button variant="gradient" size="xs" color="primary" onClick={() => handleEnrollQR()}>
                Wygeneruj
              </Button>
              {enrollUrl !== null && (
                <Link href={enrollUrl} target="_blank" className="text-sm underline text-blue-800">
                  Pokaż kod
                </Link>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Typography type="p">Do list startowych:</Typography>
              <Button variant="gradient" size="xs" color="primary" onClick={() => handleListQR()}>
                Wygeneruj
              </Button>
              {listUrl !== null && (
                <Link href={listUrl} target="_blank" className="text-sm underline text-blue-800">
                  Pokaż kod
                </Link>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Typography type="p">Do wyników:</Typography>
              <Button variant="gradient" size="xs" color="primary" onClick={() => handleResultsQR()}>
                Wygeneruj
              </Button>
              {resultsUrl !== null && (
                <Link href={resultsUrl} target="_blank" className="text-sm underline text-blue-800">
                  Pokaż kod
                </Link>
              )}
            </div>
            <div className="mb-1 flex items-center justify-end gap-2">
              <Dialog.DismissTrigger as={Button} variant="gradient" color="info" disabled={loading}>
                Zamknij
              </Dialog.DismissTrigger>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog>
  );
};

export default QRCodesDialog;
