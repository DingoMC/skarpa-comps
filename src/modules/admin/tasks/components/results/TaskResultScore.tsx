'use client';

import { Typography } from '@/lib/mui';
import { calculateScoreSingle } from '@/lib/results';
import { TaskResult, TaskSettings } from '@/lib/types/task';
import { Task, Task_User } from '@prisma/client';

type Props = {
  result?: Task_User;
  task: Task;
};

const TaskResultScore = ({ result, task }: Props) => {
  if (!result) return <Typography className="text-sm italic">0</Typography>;

  return (
    <Typography className="text-sm font-semibold">
      {calculateScoreSingle(JSON.parse(result.data) as TaskResult, JSON.parse(task.settings) as TaskSettings)}
    </Typography>
  );
};

export default TaskResultScore;
