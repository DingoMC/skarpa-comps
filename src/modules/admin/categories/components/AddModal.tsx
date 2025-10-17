'use client';

import { EMPTY_CATGEORY } from '@/lib/constants';
import { Button, Dialog, IconButton, Typography } from '@/lib/mui';
import InputNumber from '@/modules/inputs/components/Number';
import InputString from '@/modules/inputs/components/String';
import { Category } from '@prisma/client';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

type Props = {
  loading: boolean;
  onConfirm: (_: Category) => Promise<void>;
};

const AddModal = ({ loading, onConfirm }: Props) => {
  const [newData, setNewData] = useState(EMPTY_CATGEORY);
  const [nameError, setNameError] = useState<string | null>(null);
  const [seqError, setSeqError] = useState<string | null>(null);
  const [minError, setMinError] = useState<string | null>(null);
  const [maxError, setMaxError] = useState<string | null>(null);

  return (
    <Dialog>
      <Dialog.Trigger as={IconButton} variant="ghost" size="sm" color="secondary">
        <FaPlus className="w-5 h-5 text-white" />
      </Dialog.Trigger>
      <Dialog.Overlay>
        <Dialog.Content>
          <div className="flex items-center justify-between gap-4">
            <Typography type="h6">Nowa kategoria</Typography>
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
          <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] gap-2 mb-6 mt-2">
            <Typography className="text-foreground">Lp.:</Typography>
            <div className="flex flex-col">
              <InputNumber
                optional={false}
                disabled={loading}
                value={newData.seq}
                error={seqError !== null}
                onChange={(v, e) => {
                  setNewData((prevState) => ({ ...prevState, seq: v }));
                  setSeqError(e);
                }}
              />
              <Typography className="text-xs text-red-600">{seqError}</Typography>
            </div>
            <Typography className="text-foreground">Nazwa:</Typography>
            <div className="flex flex-col">
              <InputString
                required
                disabled={loading}
                value={newData.name}
                error={nameError !== null}
                onChange={(v, e) => {
                  setNewData((prevState) => ({ ...prevState, name: v }));
                  setNameError(e);
                }}
              />
              <Typography className="text-xs text-red-600">{nameError}</Typography>
            </div>
            <Typography className="text-foreground">Min. Wiek:</Typography>
            <div className="flex flex-col">
              <InputNumber
                optional
                disabled={loading}
                value={newData.minAge}
                error={minError !== null}
                min={0}
                max={newData.maxAge !== null ? Math.min(120, newData.maxAge) : 120}
                onChange={(v, e) => {
                  setNewData((prevState) => ({ ...prevState, minAge: v }));
                  setMinError(e);
                }}
              />
              <Typography className="text-xs text-red-600">{minError}</Typography>
            </div>
            <Typography className="text-foreground">Max. Wiek:</Typography>
            <div className="flex flex-col">
              <InputNumber
                optional
                disabled={loading}
                value={newData.maxAge}
                error={maxError !== null}
                min={newData.minAge !== null ? newData.minAge : 0}
                max={120}
                onChange={(v, e) => {
                  setNewData((prevState) => ({ ...prevState, maxAge: v }));
                  setMaxError(e);
                }}
              />
              <Typography className="text-xs text-red-600">{maxError}</Typography>
            </div>
          </div>
          <div className="mb-1 flex items-center justify-end gap-2">
            <Dialog.DismissTrigger as={Button} variant="ghost" color="error" disabled={loading}>
              Anuluj
            </Dialog.DismissTrigger>
            <Button onClick={() => onConfirm(newData)} disabled={loading}>
              Dodaj
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog>
  );
};

export default AddModal;
