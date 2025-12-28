'use client';

import { Button, Dialog, IconButton, Switch, Typography } from '@/lib/mui';
import { TaskRange } from '@/lib/types/task';
import InputNumber from '@/modules/inputs/components/Number';
import InputRealNumber from '@/modules/inputs/components/RealNumber';
import { useEffect, useMemo, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

type Props = {
  loading: boolean;
  otherRanges: TaskRange[];
  onConfirm: (_: TaskRange) => void;
};

const NewTimeRangeDialog = ({ loading, otherRanges, onConfirm }: Props) => {
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState<TaskRange>({
    min: otherRanges.length > 0 ? otherRanges[0].max : 0,
    minInclusive: otherRanges.length > 0 ? !otherRanges[0].maxInclusive : true,
    max: otherRanges.length > 0 ? otherRanges[0].max + 1 : 1,
    maxInclusive: true,
    score: 0,
  });

  const saveDisabled = useMemo(() => newData.min > newData.max, [newData]);
  const rangeError = useMemo(() => (newData.min >= newData.max ? 'Nieprawidłowy zakres.' : null), [newData]);

  useEffect(() => {
    setNewData({
      min: otherRanges.length > 0 ? otherRanges[0].max : 0,
      minInclusive: otherRanges.length > 0 ? !otherRanges[0].maxInclusive : true,
      max: otherRanges.length > 0 ? otherRanges[0].max + 1 : 1,
      maxInclusive: true,
      score: 0,
    });
  }, [open, otherRanges]);

  const handleSave = () => {
    onConfirm(newData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger as={Button} variant="gradient" size="sm" color="info" onClick={() => setOpen(!open)}>
        Dodaj
      </Dialog.Trigger>
      <Dialog.Overlay>
        <Dialog.Content>
          <div className="flex items-center justify-between gap-4">
            <Typography type="h6">Nowy przedział czasowy</Typography>
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
          <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] gap-2 mb-6 mt-2 md:items-center">
            <Typography className="text-foreground text-sm">Min.:</Typography>
            <div className="flex flex-col">
              <InputRealNumber
                optional={false}
                disabled={loading || otherRanges.length > 0}
                value={newData.min}
                min={0}
                maxPrecision={3}
                onChange={(v) => {
                  setNewData((prevState) => ({ ...prevState, min: v }));
                }}
              />
            </div>
            <Typography className="text-foreground text-sm">Uwzględnij Min.:</Typography>
            <Switch
              color="success"
              className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
              disabled={loading || otherRanges.length > 0}
              checked={newData.minInclusive}
              onChange={() => {
                setNewData((prevState) => ({ ...prevState, minInclusive: !prevState.minInclusive }));
              }}
            />
            <Typography className="text-foreground text-sm">Max.:</Typography>
            <div className="flex flex-col">
              <InputRealNumber
                optional={false}
                disabled={loading}
                value={newData.max}
                min={0}
                maxPrecision={3}
                onChange={(v) => {
                  setNewData((prevState) => ({ ...prevState, max: v }));
                }}
              />
            </div>
            <Typography className="text-foreground text-sm">Uwzględnij Max.:</Typography>
            <Switch
              color="success"
              className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
              disabled={loading}
              checked={newData.maxInclusive}
              onChange={() => {
                setNewData((prevState) => ({ ...prevState, maxInclusive: !prevState.maxInclusive }));
              }}
            />
            <Typography className="text-foreground text-sm">Punkty:</Typography>
            <div className="flex flex-col">
              <InputNumber
                optional={false}
                disabled={loading}
                value={newData.score}
                min={0}
                onChange={(v) => {
                  setNewData((prevState) => ({ ...prevState, score: v }));
                }}
              />
            </div>
            <Typography className="col-span-2 text-red-600 text-sm">{rangeError}</Typography>
          </div>
          <div className="mb-1 flex items-center justify-end gap-2">
            <Dialog.DismissTrigger as={Button} variant="ghost" color="error" disabled={loading}>
              Anuluj
            </Dialog.DismissTrigger>
            <Button onClick={() => handleSave()} disabled={loading || saveDisabled || rangeError !== null}>
              Dodaj
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog>
  );
};

export default NewTimeRangeDialog;
