'use client';

import { Button, Typography } from '@/lib/mui';
import { TaskCategoryIds } from '@/lib/types/task';
import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardFrame from '@/modules/dashboard/components';
import SelectCategoryMulti from '@/modules/inputs/components/CategorySelectorMulti';
import InputString from '@/modules/inputs/components/String';
import SelectTaskType from '@/modules/inputs/components/TaskTypeSelector';
import { Category, Task, TaskScoringTemplate } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import EditTaskSettings from './TaskSettings';

type Props = {
  loading: boolean;
  categories: Category[];
  original: TaskCategoryIds;
  templates: TaskScoringTemplate[];
  onAddTemplate: (_n: string, _s: string) => Promise<void>;
  handleUpdate: (_t: Task, _c: string[]) => Promise<void>;
  handleBack: () => void;
};

const EditTask = ({ original, loading, categories, templates, onAddTemplate, handleUpdate, handleBack }: Props) => {
  const [task, setTask] = useState(original);
  const [categoryIds, setCategoryIds] = useState(original.categories.map((v) => v.categoryId));
  const [nameError, setNameError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState(false);
  const saveDisabled = useMemo(
    () => nameError !== null || settingsError || loading || !task.name.trim().length || !task.shortName.trim().length,
    [task, nameError, settingsError, loading]
  );

  useEffect(() => {
    setTask({ ...original });
    setCategoryIds([...original.categories.map((v) => v.categoryId)]);
  }, [original, categories]);

  return (
    <DashboardFrame
      title={`Edytuj Zadanie - ${original.name}`}
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
        <EditTaskSettings
          settings={task.settings}
          loading={loading}
          onChange={(settings) => setTask((prev) => ({ ...prev, settings }))}
          onError={(e) => setSettingsError(e)}
          templates={templates}
          onAddTemplate={onAddTemplate}
        />
      </div>
      <div className="flex justify-center mt-2">
        <Button
          color="info"
          disabled={saveDisabled}
          onClick={() => handleUpdate(task, categoryIds)}
          className={`${saveDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {loading ? 'Zapisywanie...' : 'Zapisz'}
        </Button>
      </div>
    </DashboardFrame>
  );
};

export default EditTask;
