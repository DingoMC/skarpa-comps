'use client';

import { Button, Dialog, IconButton, Typography } from '@/lib/mui';
import { ReactNode } from 'react';
import { IoMdClose } from 'react-icons/io';

type Props = {
  header?: string;
  content?: string;
  triggerAs: 'text' | 'icon';
  trigger: ReactNode;
  triggerVariant?: 'solid' | 'outline' | 'gradient' | 'ghost';
  triggerSize?: 'sm' | 'md' | 'lg';
  triggerColor?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  triggerClassName?: string;
  triggerDisabled?: boolean;
  loading?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onConfirm: () => void;
};

const ConfirmDialog = ({
  header,
  trigger,
  triggerAs,
  content,
  loading,
  cancelButtonText,
  confirmButtonText,
  triggerColor,
  triggerSize,
  triggerVariant,
  triggerClassName,
  triggerDisabled,
  onConfirm,
}: Props) => (
  <Dialog>
    <Dialog.Trigger
      as={triggerAs === 'icon' ? IconButton : Button}
      color={triggerColor}
      variant={triggerVariant ?? 'ghost'}
      size={triggerSize ?? 'sm'}
      disabled={loading || triggerDisabled}
      className={triggerClassName}
    >
      {trigger}
    </Dialog.Trigger>
    <Dialog.Overlay>
      <Dialog.Content>
        <div className="flex items-center justify-between gap-4">
          <Typography type="h6">{header ?? 'Potwierdzenie'}</Typography>
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
        <Typography className="mb-6 mt-2 text-foreground">{content}</Typography>
        <div className="mb-1 flex items-center justify-end gap-2">
          <Dialog.DismissTrigger as={Button} variant="ghost" color="error" disabled={loading}>
            {cancelButtonText ?? 'Anuluj'}
          </Dialog.DismissTrigger>
          <Button onClick={() => onConfirm()} disabled={loading}>
            {confirmButtonText ?? 'Potwierdź'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Overlay>
  </Dialog>
);

export default ConfirmDialog;
