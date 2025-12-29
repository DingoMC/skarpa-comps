'use client';

import { Card, IconButton, Tooltip, Typography } from '@/lib/mui';
import ConfirmDialog from '@/modules/dialogs/ConfirmDialog';
import { TaskScoringTemplate } from '@prisma/client';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { TbTemplate } from 'react-icons/tb';

type Props = {
  loading: boolean;
  templates: TaskScoringTemplate[];
  onDelete: (_: string) => void;
};

const TaskTemplatesPopover = ({ loading, templates, onDelete }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Tooltip>
        <Tooltip.Trigger as={IconButton} onClick={toggleDropdown} color="secondary" variant="ghost" size="sm" className="cursor-pointer">
          <TbTemplate className="w-5 h-5 text-white" />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Typography className="text-xs">Szablony zadań</Typography>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip>
      {isOpen && (
        <Card className="absolute right-0 p-2 w-50 h-40 bg-white border border-gray-300 rounded-xl shadow-lg z-50 overflow-y-auto">
          <Typography className="text-sm font-semibold">Szablony zadań</Typography>
          <div className="w-full h-px bg-gray-300 my-1" />
          {!templates.length && <Typography className="text-xs">Nie utworzono żadnych szablonów.</Typography>}
          {templates.map((t) => (
            <div key={t.id} className="flex gap-1 items-center">
              <Typography className="text-xs">{t.name}</Typography>
              <ConfirmDialog
                triggerAs="icon"
                trigger={<FaTrash className="w-4 h-4 text-red-600" />}
                loading={loading}
                header="Potwierdź usunięcie zadania"
                content={`Czy na pewno chcesz usunąć szablon "${t.name}"?`}
                onConfirm={() => onDelete(t.id)}
              />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default TaskTemplatesPopover;
