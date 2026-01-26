'use client';

import { TaskResult, TaskSettings } from '@/lib/types/task';
import InputRealNumber from '@/modules/inputs/components/RealNumber';
import SelectZone from '@/modules/inputs/components/ZoneSelector';
import { Task, Task_User } from '@prisma/client';
import { useMemo } from 'react';

type Props = {
  result?: Task_User;
  task: Task;
  loading: boolean;
  onChange: (_: string) => void;
};

const EditTaskScore = ({ result, task, loading, onChange }: Props) => {
  const data = useMemo(() => {
    if (!result) return { attempts: [] } as TaskResult;
    if (!result.data.length) return { attempts: [] } as TaskResult;
    try {
      return JSON.parse(result.data) as TaskResult;
    } catch {
      return { attempts: [] } as TaskResult;
    }
  }, [result]);
  const settings = useMemo(() => JSON.parse(task.settings) as TaskSettings, [task]);

  const handleChange = (newData: TaskResult) => {
    onChange(JSON.stringify(newData));
  };

  const handleChangeZone = (value: string | null) => {
    if (settings.scoringSystem !== 'zones') {
      onChange(JSON.stringify({ ...data }));
      return;
    }
    if (value === null) {
      onChange(JSON.stringify({ ...data, attempts: [] }));
      return;
    }
    const f = settings.zones.find((z) => z.shortName === value);
    if (!f) {
      onChange(JSON.stringify({ ...data, attempts: [] }));
      return;
    }
    onChange(JSON.stringify({ ...data, attempts: [{ zone: { ...f } }] }));
  };

  const getValueAtIndex = (index: number) => {
    if (index >= data.attempts.length) return null;
    return data.attempts[index].value ?? null;
  };

  const changeValueAtIndex = (index: number, value: number | null) => {
    const arrLength = settings.maxAttempts === null ? 1 : settings.maxAttempts;
    const newAttempts = [...data.attempts];
    if (arrLength > data.attempts.length) {
      for (let i = 0; i < arrLength - data.attempts.length; i++) {
        newAttempts.push({});
      }
    }
    onChange(
      JSON.stringify({
        ...data,
        attempts: newAttempts.map((a, i) => {
          if (i !== index) return { ...a };
          return { value };
        }),
      })
    );
  };

  if (
    settings.scoringSystem === 'normal'
    || settings.scoringSystem === 'linear'
    || settings.scoringSystem === 'multilinear'
    || settings.scoringSystem === 'ranges'
  ) {
    const currentValue = data.attempts.length > 0 && data.attempts[0].value ? data.attempts[0].value : null;
    return (
      <InputRealNumber
        optional
        value={currentValue}
        disabled={loading}
        onChange={(v) => handleChange({ ...data, attempts: v === null ? [] : [{ value: v }] })}
      />
    );
  }

  if (settings.scoringSystem === 'zones') {
    return (
      <SelectZone
        disabled={loading}
        zones={settings.zones}
        value={data.attempts.length > 0 && data.attempts[0].zone ? data.attempts[0].zone.shortName : null}
        onChange={handleChangeZone}
      />
    );
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {new Array(settings.maxAttempts === null ? 1 : settings.maxAttempts).fill(0).map((_, i) => (
        <div key={i} className="max-w-[100px]">
          <InputRealNumber optional disabled={loading} value={getValueAtIndex(i)} onChange={(v) => changeValueAtIndex(i, v)} />
        </div>
      ))}
    </div>
  );
};

export default EditTaskScore;
