'use client';

import { Button } from '@/lib/mui';
import { calculateScoreSingle } from '@/lib/results';
import { displayFullName } from '@/lib/text';
import { StartListAdmin } from '@/lib/types/startList';
import { TaskResult, TaskSettings } from '@/lib/types/task';
import EditTaskScore from '@/modules/admin/tasks/components/results/EditTaskScore';
import TaskResultScore from '@/modules/admin/tasks/components/results/TaskResultScore';
import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardFrame from '@/modules/dashboard/components';
import NoData from '@/modules/lottie/NoData';
import { Task, Task_User } from '@prisma/client';
import { useEffect, useState } from 'react';

type Props = {
  loading: boolean;
  enroll: StartListAdmin;
  originalResults: Task_User[];
  tasks: Task[];
  handleUpdate: (_r: Task_User[]) => Promise<void>;
  handleBack: () => void;
};

const classes = {
  tableWrapper: 'overflow-x-scroll lg:overflow-x-auto overflow-y-visible w-full h-full',
  table: 'w-full table-auto',
  thead: 'bg-white',
  headerRow: 'uppercase',
  th: 'py-2 px-4 text-sm font-medium border-b border-b-gray-300',
  thLittlePadding: 'py-1 px-2 text-sm font-medium border-b border-b-gray-300',
  nodata: 'p-4 md:p-8 border border-gray-100',
  row: 'even:bg-blue-gray-50/50 border-b border-b-gray-200 hover:bg-gray-100 cursor-pointer',
  cell: 'px-4 py-2 text-xs',
  cellLittlePadding: 'px-2 py-1 text-xs',
};

const EditUserResults = ({ loading, tasks, originalResults, enroll, handleUpdate, handleBack }: Props) => {
  const [editData, setEditData] = useState(originalResults);

  useEffect(() => {
    setEditData([...originalResults]);
  }, [originalResults]);

  return (
    <DashboardFrame
      title={`Wyniki Uczestnika - ${displayFullName(enroll.user.firstName, enroll.user.lastName)}`}
      refreshing={loading}
      cardHeaderRight={<TemplateButton template="back" disabled={loading} onClick={handleBack} />}
    >
      <div className="flex flex-col gap-4 w-full">
        {tasks.length > 0 ? (
          <>
            <div className={classes.tableWrapper}>
              <table className={classes.table}>
                <thead className={classes.thead}>
                  <tr className={classes.headerRow}>
                    <th className={classes.thLittlePadding}>Zadanie</th>
                    <th className={classes.thLittlePadding}>Wynik</th>
                    <th className={classes.thLittlePadding}>Punkty</th>
                    <th className={classes.thLittlePadding}>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id} className={classes.row}>
                      <td className={classes.cellLittlePadding}>{`${t.name} (${t.shortName})`}</td>
                      <td className={classes.cellLittlePadding}>
                        <EditTaskScore
                          result={editData.find((v) => v.taskId === t.id)}
                          task={t}
                          loading={loading}
                          onChange={(v) => {
                            const f = editData.find((res) => res.taskId === t.id);
                            if (!f) {
                              setEditData((prev) => [
                                ...prev,
                                {
                                  id: '',
                                  taskId: t.id,
                                  userCompId: enroll.id,
                                  data: v,
                                  score: calculateScoreSingle(JSON.parse(v) as TaskResult, JSON.parse(t.settings) as TaskSettings),
                                  createdAt: new Date(),
                                  updatedAt: new Date(),
                                },
                              ]);
                            } else {
                              setEditData((prev) =>
                                prev.map((res) => {
                                  if (res.taskId !== enroll.id) return { ...res };
                                  return {
                                    ...res,
                                    data: v,
                                    score: calculateScoreSingle(JSON.parse(v) as TaskResult, JSON.parse(t.settings) as TaskSettings),
                                  };
                                })
                              );
                            }
                          }}
                        />
                      </td>
                      <td className={classes.cellLittlePadding}>
                        <TaskResultScore result={editData.find((v) => v.taskId === t.id)} task={t} />
                      </td>
                      <td className={classes.cellLittlePadding}>
                        {editData.find((v) => v.taskId === t.id) !== undefined && (
                          <TemplateButton
                            template="delete"
                            message="Wyczyść wynik"
                            disabled={loading}
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditData((prev) => prev.filter((res) => res.taskId !== t.id));
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full flex justify-center">
              <Button onClick={() => handleUpdate([...editData])} disabled={loading}>
                Zapisz
              </Button>
            </div>
          </>
        ) : (
          <NoData message="Brak zadań dla wskazanej kategorii do której należy uczestnik." />
        )}
      </div>
    </DashboardFrame>
  );
};

export default EditUserResults;
