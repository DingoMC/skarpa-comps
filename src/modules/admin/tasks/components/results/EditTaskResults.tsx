'use client';

import { SUPER_ADMIN_AUTH_LEVEL } from '@/lib/constants';
import { Button, Typography } from '@/lib/mui';
import { calculateScoreSingle } from '@/lib/results';
import { StartListEntry } from '@/lib/types/startList';
import { TaskResult, TaskSettings } from '@/lib/types/task';
import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardFrame from '@/modules/dashboard/components';
import { generateCategoryLabel } from '@/modules/inputs/components/CategorySelector';
import SelectCategoryOptional from '@/modules/inputs/components/CategorySelectorOptional';
import NoData from '@/modules/lottie/NoData';
import { Category, Role, Task, Task_User } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import EditTaskScore from './EditTaskScore';
import TaskResultScore from './TaskResultScore';
import UserBadge from './User';

type Props = {
  loading: boolean;
  task: Task;
  categories: Category[];
  originalResults: Task_User[];
  users: StartListEntry[];
  roles: Role[];
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

const EditTaskResults = ({ loading, task, categories, originalResults, users, roles, handleUpdate, handleBack }: Props) => {
  const [filterCatgoryId, setFilterCategoryId] = useState<string | null>(null);
  const [editData, setEditData] = useState(originalResults);
  const filteredUsers = useMemo(
    () => users.filter((u) => filterCatgoryId === null || u.categoryId === filterCatgoryId),
    [users, filterCatgoryId]
  );

  useEffect(() => {
    setEditData([...originalResults]);
  }, [originalResults]);

  return (
    <DashboardFrame
      title={`Wyniki Zadania - ${task.name}`}
      refreshing={loading}
      cardHeaderRight={<TemplateButton template="back" disabled={loading} onClick={handleBack} />}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-0.5 max-w-[200px]">
          <Typography className="text-xs">(Filtr Kategorii)</Typography>
          <SelectCategoryOptional
            categories={categories}
            value={filterCatgoryId}
            onChange={(v) => setFilterCategoryId(v)}
            disabled={loading}
          />
        </div>
        {filteredUsers.length > 0 ? (
          <>
            <div className={classes.tableWrapper}>
              <table className={classes.table}>
                <thead className={classes.thead}>
                  <tr className={classes.headerRow}>
                    <th className={classes.thLittlePadding}>Zawodnik</th>
                    <th className={classes.thLittlePadding}>Kategoria</th>
                    <th className={classes.thLittlePadding}>Wynik</th>
                    <th className={classes.thLittlePadding}>Punkty</th>
                    <th className={classes.thLittlePadding}>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className={classes.row}>
                      <td className={classes.cellLittlePadding}>
                        <UserBadge
                          user={u}
                          sparkleText={roles
                            .filter((r) => r.authLevel >= SUPER_ADMIN_AUTH_LEVEL)
                            .map((v) => v.id)
                            .includes(u.user.roleId)}
                        />
                      </td>
                      <td className={classes.cellLittlePadding}>
                        {generateCategoryLabel(
                          categories.find((v) => v.id === u.categoryId),
                          true
                        )}
                      </td>
                      <td className={classes.cellLittlePadding}>
                        <EditTaskScore
                          result={editData.find((v) => v.userCompId === u.id)}
                          task={task}
                          loading={loading}
                          onChange={(v) => {
                            const f = editData.find((res) => res.userCompId === u.id);
                            if (!f) {
                              setEditData((prev) => [
                                ...prev,
                                {
                                  id: '',
                                  taskId: task.id,
                                  userCompId: u.id,
                                  data: v,
                                  score: calculateScoreSingle(JSON.parse(v) as TaskResult, JSON.parse(task.settings) as TaskSettings),
                                  createdAt: new Date(),
                                  updatedAt: new Date(),
                                },
                              ]);
                            } else {
                              setEditData((prev) =>
                                prev.map((res) => {
                                  if (res.userCompId !== u.id) return { ...res };
                                  return {
                                    ...res,
                                    data: v,
                                    score: calculateScoreSingle(JSON.parse(v) as TaskResult, JSON.parse(task.settings) as TaskSettings),
                                  };
                                })
                              );
                            }
                          }}
                        />
                      </td>
                      <td className={classes.cellLittlePadding}>
                        <TaskResultScore result={editData.find((v) => v.userCompId === u.id)} task={task} />
                      </td>
                      <td className={classes.cellLittlePadding}>
                        {editData.find((v) => v.userCompId === u.id) !== undefined && (
                          <TemplateButton
                            template="delete"
                            message="Wyczyść wynik"
                            disabled={loading}
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditData((prev) => prev.filter((res) => res.userCompId !== u.id));
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
          <NoData message="Brak zawodników dla wskazanej kategorii/zadania." />
        )}
      </div>
    </DashboardFrame>
  );
};

export default EditTaskResults;
