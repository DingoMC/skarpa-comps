import { SUPER_ADMIN_AUTH_LEVEL } from '@/lib/constants';
import { columnNamesPL } from '@/lib/constants/lang_pl';
import { Tooltip, Typography } from '@/lib/mui';
import { transformName } from '@/lib/text';
import { ResultsSummary } from '@/lib/types/results';
import { TaskSettings } from '@/lib/types/task';
import SparkleText from '@/modules/decoration/components/SparkleText';
import { Role, Task } from '@prisma/client';
import { AccessorColumnDef, createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ResultsSummary>();

export const columns = (tasks: Task[], roles: Role[]) => {
  const staticColumns: AccessorColumnDef<ResultsSummary, any>[] = [
    columnHelper.accessor((row) => row.place, {
      id: 'place',
      header: () => <div className="text-left">{columnNamesPL.get('place')}</div>,
      cell: (info) => {
        const place = info.getValue();
        if (!place) return '-';
        return <Typography className="font-semibold text-xs">{place.toFixed(0)}</Typography>;
      },
      enableSorting: true,
      enableHiding: false,
      size: 5,
    }),
    columnHelper.accessor((row) => row.startNumber, {
      id: 'startNumber',
      header: () => <div className="text-left">{columnNamesPL.get('startNumber')}</div>,
      cell: (info) => {
        if (!info.getValue()) return '-';
        return info.getValue().toFixed(0);
      },
      enableColumnFilter: true,
      enableSorting: true,
      enableHiding: false,
      size: 5,
    }),
    columnHelper.accessor((row) => row.user.firstName, {
      id: 'firstName',
      header: () => <div className="text-left">{columnNamesPL.get('firstName')}</div>,
      cell: (info) => {
        const { roleId } = info.row.original.user;
        const authLevel = roles.find((r) => r.id === roleId)?.authLevel ?? 0;
        if (authLevel >= SUPER_ADMIN_AUTH_LEVEL) {
          return (
            <SparkleText id={`${info.row.original.id}-firstName`} textClassName="text-purple-950">
              {transformName(info.getValue())}
            </SparkleText>
          );
        }
        return transformName(info.getValue());
      },
      enableColumnFilter: true,
      enableSorting: true,
    }),
    columnHelper.accessor((row) => row.user.lastName, {
      id: 'lastName',
      header: () => <div className="text-left">{columnNamesPL.get('lastName')}</div>,
      cell: (info) => {
        const { roleId } = info.row.original.user;
        const authLevel = roles.find((r) => r.id === roleId)?.authLevel ?? 0;
        if (authLevel >= SUPER_ADMIN_AUTH_LEVEL) {
          return (
            <SparkleText id={`${info.row.original.id}-lastName`} textClassName="text-purple-950">
              {transformName(info.getValue())}
            </SparkleText>
          );
        }
        return transformName(info.getValue());
      },
      enableColumnFilter: true,
      enableSorting: true,
    }),
    columnHelper.accessor((row) => row.clubName, {
      id: 'clubName',
      header: () => <div className="text-left">{columnNamesPL.get('clubName')}</div>,
      cell: (info) => info.getValue() ?? '-',
      enableColumnFilter: true,
      enableSorting: true,
    }),
    columnHelper.accessor((row) => row.score, {
      id: 'score',
      header: () => <div className="text-left">{columnNamesPL.get('score')}</div>,
      cell: (info) => <Typography className="font-semibold text-xs">{info.getValue().toFixed(0)}</Typography>,
      enableColumnFilter: true,
      enableSorting: true,
      size: 5,
    }),
  ];
  const sortedTasks = tasks.toSorted((a, b) => a.shortName.localeCompare(b.shortName, 'pl'));
  for (const t of sortedTasks) {
    staticColumns.push(
      columnHelper.accessor((row) => row, {
        id: t.id,
        header: () => <div className="text-left">{t.shortName}</div>,
        cell: (info) => {
          const score = info.row.original.partial[t.id];
          const settings = JSON.parse(t.settings) as TaskSettings;
          if (!score) {
            return (
              <Tooltip>
                <Tooltip.Trigger>
                  <Typography className="text-xs cursor-pointer">0</Typography>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <div className="flex flex-col gap-1">
                    <Typography className="text-xs">Szczegóły:</Typography>
                    <Typography className="text-xs">Brak podejść dla wskazanego zadania.</Typography>
                  </div>
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip>
            );
          }
          return (
            <Tooltip>
              <Tooltip.Trigger>
                <Typography className="text-xs cursor-pointer">{score.score.toFixed(0)}</Typography>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <div className="flex flex-col gap-1">
                  <Typography className="text-xs">Szczegóły:</Typography>
                  {score.data.attempts.length === 0 && <Typography className="text-xs">Brak podejść dla wskazanego zadania.</Typography>}
                  {score.data.attempts.length > 0 && (
                    <div className="flex flex-col">
                      {score.data.attempts.map((a, i) => {
                        if (a.value !== undefined) {
                          return (
                            <Typography key={i} className="text-xs text-gray-100">
                              {`${settings.maxAttempts !== null ? `Próba ${i + 1} : ` : ''}
                              ${settings.scoringSystem === 'time' ? `${a.value.toFixed(3)}s` : a.value.toFixed(0)}`}
                            </Typography>
                          );
                        }
                        if (a.zone !== undefined) {
                          return (
                            <Typography key={i} className="text-xs text-gray-100">
                              {`${settings.maxAttempts !== null ? `Próba ${i + 1} : ` : ''}
                              ${a.zone.name} (${a.zone.shortName}) - ${a.zone.score} pkt.`}
                            </Typography>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip>
          );
        },
      })
    );
  }
  return staticColumns;
};
