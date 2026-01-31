'use client';

import { Typography } from '@/lib/mui';
import { ResultsSummary } from '@/lib/types/results';
import SelectCategory from '@/modules/inputs/components/CategorySelector';
import SelectCompetition from '@/modules/inputs/components/CompSelector';
import DashboardTable from '@/modules/table/components';
import { Category, Competition, Role, Task } from '@prisma/client';
import { columns } from '../utils/columns';

type Props = {
  data: { men: ResultsSummary[]; women: ResultsSummary[]; tasks: Task[] };
  loading: boolean;
  roles: Role[];
  categories: Category[];
  competitions: Competition[];
  onRefresh: () => Promise<void>;
  selectedComp: Competition;
  selectedCategory: Category;
  onChangeComp: (_: string) => void;
  onChangeCategory: (_: string) => void;
};

const Results = ({
  data,
  loading,
  competitions,
  categories,
  roles,
  selectedComp,
  selectedCategory,
  onRefresh,
  onChangeComp,
  onChangeCategory,
}: Props) => (
  <div className="flex flex-col gap-2">
    <div className="flex flex-col gap-0.5 max-w-[200px] mb-2">
      <Typography className="text-xs">(Wybierz zawody)</Typography>
      <SelectCompetition
        competitions={competitions}
        value={selectedComp.id}
        onChange={(v) => {
          if (v !== null) onChangeComp(v);
        }}
        disabled={loading}
      />
    </div>
    <div className="flex flex-col gap-0.5 max-w-[200px]">
      <Typography className="text-xs">(Wybierz kategorię)</Typography>
      <SelectCategory
        categories={categories}
        value={selectedCategory.id}
        onChange={(v) => {
          if (v !== null) onChangeCategory(v);
        }}
        disabled={loading}
      />
    </div>
    <div className="max-w-screen md:max-w-[calc(100vw-232px)] overflow-y-visible">
      <DashboardTable
        noActionButtons
        title={`Wyniki - ${selectedComp.name} - Kobiety`}
        noDataMessage="Nie znaleziono zawodników. Zmień filtry lub wybierz inne zawody."
        data={data.women}
        refetching={loading}
        columns={columns(data.tasks, roles)}
        onRefresh={onRefresh}
        cardBodyClassName="overflow-x-visible"
      />
    </div>
    <div className="max-w-screen md:max-w-[calc(100vw-232px)] overflow-y-visible">
      <DashboardTable
        noActionButtons
        title={`Wyniki - ${selectedComp.name} - Mężczyźni`}
        noDataMessage="Nie znaleziono zawodników. Zmień filtry lub wybierz inne zawody."
        data={data.men}
        refetching={loading}
        columns={columns(data.tasks, roles)}
        onRefresh={onRefresh}
        cardBodyClassName="overflow-x-visible"
      />
    </div>
  </div>
);

export default Results;
