'use client';

import { EMPTY_ENROLL_RENUMBER } from '@/lib/constants';
import { Button, Dialog, IconButton, Switch, Tooltip, Typography } from '@/lib/mui';
import { EnrollReNumberReq } from '@/lib/types/enroll';
import { StartListAdmin } from '@/lib/types/startList';
import InputNumber from '@/modules/inputs/components/Number';
import { useMemo, useState } from 'react';
import { FaHourglassEnd, FaTimes } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { MdWarning } from 'react-icons/md';
import { TiSortNumericallyOutline } from 'react-icons/ti';
import SelectReNumberOrder from './RenumberOrderSelector';

type Props = {
  loading: boolean;
  renumbering: boolean;
  data: StartListAdmin[];
  onConfirmRenumber: (_: EnrollReNumberReq) => Promise<void>;
};

const RenumberDialog = ({ loading, renumbering, data, onConfirmRenumber }: Props) => {
  const [open, setOpen] = useState(false);
  const [renumberData, setRenumberData] = useState({ ...EMPTY_ENROLL_RENUMBER });
  const [startError, setStartError] = useState<string | null>(null);
  const [safetyGapError, setSafetyGapError] = useState<string | null>(null);
  const [multipleOfError, setMultipleOfError] = useState<string | null>(null);
  const saveDisabled = useMemo(
    () => startError !== null || safetyGapError !== null || multipleOfError !== null,
    [startError, safetyGapError, multipleOfError]
  );
  const emptyNumbers = useMemo(() => data.filter((v) => v.startNumber === 0).length, [data]);
  const numberOccurences = useMemo(() => {
    const startNumbers = data.map((v) => v.startNumber).filter((v) => v !== 0);
    const occur: { [key: string]: number } = {};
    startNumbers.forEach((sn) => {
      if (occur[sn.toFixed(0)]) occur[sn.toFixed(0)]++;
      else occur[sn.toFixed(0)] = 1;
    });
    return Object.entries(occur)
      .filter(([, v]) => v > 1)
      .toSorted((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10));
  }, [data]);

  const iconColor = () => {
    if (renumbering) return 'text-blue-300';
    if (numberOccurences.length) return 'text-red-300';
    if (emptyNumbers > 0) return 'text-yellow-300';
    return 'text-green-200';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger as={Tooltip}>
        <Tooltip.Trigger onClick={() => setOpen(!open)}>
          <div
            className={`w-[34px] h-[34px] flex items-center justify-center
              cursor-pointer border transition-all duration-300 ease-in rounded-md
              bg-transparent border-transparent hover:bg-secondary/10
              hover:border-secondary/10`}
          >
            <TiSortNumericallyOutline className={`w-5 h-5 ${iconColor()} ${renumbering ? 'animate-pulse' : ''}`} />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <div className="flex flex-col gap-1">
            <Typography className="text-xs">Edycja numerów startowych.</Typography>
            {renumbering && (
              <div className="flex gap-1 items-center text-blue-200 animate-pulse">
                <FaHourglassEnd className="w-4 h-4" />
                <Typography className="text-xs">Trwa nadawanie numerów...</Typography>
              </div>
            )}
            {emptyNumbers === 0 ? (
              <div className="flex gap-1 items-center text-green-200">
                <FaCheck className="w-4 h-4" />
                <Typography className="text-xs">Wszyscy zawodnicy posiadają numery startowe.</Typography>
              </div>
            ) : (
              <div className="flex gap-1 items-center text-yellow-200">
                <MdWarning className="w-4 h-4" />
                <Typography className="text-xs">
                  {`${emptyNumbers} zawodnik${emptyNumbers > 1 ? 'ów' : ''} nie posiada numeru startowego.`}
                </Typography>
              </div>
            )}
            {!numberOccurences.length ? (
              <div className="flex gap-1 items-center text-green-200">
                <FaCheck className="w-4 h-4" />
                <Typography className="text-xs">Brak duplikatów numerów startowych.</Typography>
              </div>
            ) : (
              <div className="flex gap-1 items-center text-red-200">
                <FaTimes className="w-4 h-4" />
                <Typography className="text-xs">Wykryto duplikaty numerów startowych.</Typography>
              </div>
            )}
          </div>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Dialog.Trigger>
      <Dialog.Overlay>
        <Dialog.Content>
          <div className="flex items-center justify-between gap-4">
            <Typography type="h6">Numery startowe</Typography>
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
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Typography type="p">Raport ostrzeżeń</Typography>
              {renumbering && (
                <div className="flex gap-1 items-center text-blue-800 animate-pulse">
                  <FaHourglassEnd className="w-4 h-4" />
                  <Typography className="text-xs">Trwa nadawanie numerów...</Typography>
                </div>
              )}
              {emptyNumbers === 0 ? (
                <div className="flex gap-1 items-center text-green-800">
                  <FaCheck className="w-4 h-4" />
                  <Typography className="text-xs">Wszyscy zawodnicy posiadają numery startowe.</Typography>
                </div>
              ) : (
                <div className="flex gap-1 items-center text-yellow-700">
                  <MdWarning className="w-4 h-4" />
                  <Typography className="text-xs">
                    {`${emptyNumbers} zawodnik${emptyNumbers > 1 ? 'ów' : ''} nie posiada numeru startowego.`}
                  </Typography>
                </div>
              )}
              {!numberOccurences.length ? (
                <div className="flex gap-1 items-center text-green-800">
                  <FaCheck className="w-4 h-4" />
                  <Typography className="text-xs">Brak duplikatów numerów startowych.</Typography>
                </div>
              ) : (
                <div className="flex flex-col gap-px text-red-600">
                  <div className="flex gap-1 items-center">
                    <FaTimes className="w-4 h-4" />
                    <Typography className="text-xs">Wykryto duplikaty numerów startowych.</Typography>
                  </div>
                  <ul className="list-disc ml-8">
                    {numberOccurences.map(([startNo, occur]) => (
                      <li className="text-xs" key={startNo}>{`Nr: ${startNo} - Wystąpień: ${occur}`}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="w-full h-px bg-gray-300" />
            <div className="flex flex-col gap-1">
              <Typography type="p">Edycja numeracji</Typography>
              <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] gap-2 md:items-center">
                <Typography className="text-foreground text-sm">Start:</Typography>
                <div className="flex flex-col gap-px">
                  <InputNumber
                    optional={false}
                    disabled={loading || renumbering}
                    error={startError !== null}
                    value={renumberData.startNumber}
                    min={1}
                    max={100000}
                    onChange={(v, e) => {
                      setRenumberData((prevState) => ({ ...prevState, startNumber: v }));
                      setStartError(e);
                    }}
                  />
                  <Typography className="col-span-2 text-red-600 text-xs">{startError}</Typography>
                </div>
                <Typography className="text-foreground text-sm">Sortuj wg:</Typography>
                <SelectReNumberOrder
                  value={renumberData.orderBy}
                  onChange={(v) => setRenumberData((prevState) => ({ ...prevState, orderBy: v }))}
                />
                <Typography className="text-foreground text-sm">Rozdziel kategorie:</Typography>
                <Switch
                  color="success"
                  className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
                  disabled={loading}
                  checked={renumberData.group}
                  onChange={() => {
                    setRenumberData((prevState) => ({ ...prevState, group: !prevState.group }));
                  }}
                />
                {renumberData.group && (
                  <>
                    <Typography className="text-foreground text-sm">Min. pustych:</Typography>
                    <div className="flex flex-col gap-px">
                      <InputNumber
                        optional={false}
                        disabled={loading || renumbering}
                        error={safetyGapError !== null}
                        value={renumberData.safetyGap}
                        min={0}
                        max={99999}
                        onChange={(v, e) => {
                          setRenumberData((prevState) => ({ ...prevState, safetyGap: v }));
                          setSafetyGapError(e);
                        }}
                      />
                      <Typography className="col-span-2 text-red-600 text-xs">{safetyGapError}</Typography>
                    </div>
                    <Typography className="text-foreground text-sm">Rozpocznij od wielokrotności:</Typography>
                    <div className="flex flex-col gap-px">
                      <InputNumber
                        optional
                        disabled={loading || renumbering}
                        error={multipleOfError !== null}
                        value={renumberData.nextFromMultipleOf}
                        min={2}
                        max={10000}
                        onChange={(v, e) => {
                          setRenumberData((prevState) => ({ ...prevState, nextFromMultipleOf: v }));
                          setMultipleOfError(e);
                        }}
                      />
                      <Typography className="col-span-2 text-red-600 text-xs">{multipleOfError}</Typography>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col w-full my-1">
                <Typography className="text-xs text-yellow-800">
                  Uwaga! Przenumerowanie zmienia numery startowe wszystkich zawodników! Przy większej liczbie zawodników może zająć kilka
                  sekund. Pamiętaj aby nie zamykać tej strony w trakcie numeracji!
                </Typography>
                <Typography className="text-xs text-cyan-700">
                  Szacowany czas numeracji: {((1.5 * data.length + 585.0) / 1000.0).toFixed(3)}s
                </Typography>
              </div>
              <div className="flex w-full justify-center">
                <Button
                  variant="gradient"
                  color="primary"
                  disabled={loading || renumbering || saveDisabled}
                  onClick={() => {
                    setOpen(!open);
                    onConfirmRenumber(renumberData);
                  }}
                >
                  Przenumeruj
                </Button>
              </div>
            </div>
            <div className="w-full h-px bg-gray-300" />
            <div className="mb-1 flex items-center justify-end gap-2">
              <Dialog.DismissTrigger as={Button} variant="gradient" color="error" disabled={loading}>
                Zamknij
              </Dialog.DismissTrigger>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog>
  );
};

export default RenumberDialog;
