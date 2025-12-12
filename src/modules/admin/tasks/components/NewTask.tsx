'use client';

import { EMPTY_TASK } from '@/lib/constants';
import { Typography } from '@/lib/mui';
import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardFrame from '@/modules/dashboard/components';
import SelectCategoryMulti from '@/modules/inputs/components/CategorySelectorMulti';
import InputString from '@/modules/inputs/components/String';
import SelectTaskType from '@/modules/inputs/components/TaskTypeSelector';
import { Category, Task } from '@prisma/client';
import { useEffect, useState } from 'react';
import EditTaskSettings from './TaskSettings';

type Props = {
  loading: boolean;
  currCompId: string;
  categories: Category[];
  handleAdd: (_t: Task, _c: string[]) => Promise<void>;
  handleBack: () => void;
};

const NewTask = ({ loading, categories, currCompId, handleAdd, handleBack }: Props) => {
  const [task, setTask] = useState({ ...EMPTY_TASK, competitionId: currCompId });
  const [categoryIds, setCategoryIds] = useState(categories.map((v) => v.id));
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    setCategoryIds(categories.map((v) => v.id));
  }, [categories]);

  return (
    <DashboardFrame
      title="Nowe Zadanie"
      refreshing={loading}
      cardHeaderRight={<TemplateButton template="back" disabled={loading} onClick={handleBack} />}
    >
      <div className="flex flex-col md:items-center md:grid md:grid-cols-[max-content_1fr] md:gap-2 gap-px w-full">
        <Typography type="p">Nazwa:</Typography>
        <div className="flex flex-col gap-px mb-2 md:mb-0 w-max">
          <InputString
            required
            error={nameError !== null}
            placeholder="Droga 1"
            disabled={loading}
            value={task.name}
            onChange={(name, e) => {
              setTask((prev) => ({ ...prev, name }));
              setNameError(e);
            }}
          />
          {nameError !== null && <Typography className="text-xs text-red-600">{nameError}</Typography>}
        </div>
        <Typography type="p">Skrót:</Typography>
        <div className="w-max">
          <InputString
            error={nameError !== null}
            placeholder="D1"
            disabled={loading}
            value={task.shortName}
            onChange={(shortName) => {
              setTask((prev) => ({ ...prev, shortName }));
            }}
          />
        </div>
        <Typography type="p">Typ:</Typography>
        <SelectTaskType value={task.type} disabled={loading} onChange={(type) => setTask((prev) => ({ ...prev, type: type ?? '' }))} />
        <Typography type="p">Kategorie wiekowe:</Typography>
        <SelectCategoryMulti
          categories={categories}
          value={categoryIds}
          disabled={loading}
          onChange={(v) => {
            if (v !== null) setCategoryIds(v);
            else setCategoryIds([]);
          }}
        />
        <Typography type="p">Ustawienia:</Typography>
        <EditTaskSettings settings={task.settings} loading={loading} onChange={(settings) => setTask((prev) => ({ ...prev, settings }))} />
      </div>
    </DashboardFrame>
  );
};

export default NewTask;
