import { Typography } from '@/lib/mui';
import { StartListEntry } from '@/lib/types/startList';
import SelectCategoryOptional from '@/modules/inputs/components/CategorySelectorOptional';
import SelectCompetition from '@/modules/inputs/components/CompSelector';
import DashboardTable from '@/modules/table/components';
import { Category, Competition, Role } from '@prisma/client';
import { useState } from 'react';
import { columns } from '../utils/columns';

type Props = {
  data: StartListEntry[];
  roles: Role[];
  categories: Category[];
  competitions: Competition[];
  selectedComp: Competition;
  loading: boolean;
  onRefresh: () => Promise<void>;
  handleSelectComp: (_: string) => void;
};

const StartLists = ({ data, roles, categories, competitions, selectedComp, loading, onRefresh, handleSelectComp }: Props) => {
  const [filterCatgoryId, setFilterCategoryId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5 max-w-[200px] mb-2">
        <Typography className="text-xs">(Wybierz zawody)</Typography>
        <SelectCompetition
          competitions={competitions}
          value={selectedComp.id}
          onChange={(v) => {
            if (v !== null) handleSelectComp(v);
          }}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-0.5 max-w-[200px]">
        <Typography className="text-xs">(Filtr Kategorii)</Typography>
        <SelectCategoryOptional
          categories={categories}
          value={filterCatgoryId}
          onChange={(v) => setFilterCategoryId(v)}
          disabled={loading}
        />
      </div>
      <div className="max-w-screen md:max-w-[calc(100vw-232px)] overflow-y-visible">
        <DashboardTable
          noActionButtons
          title="Lista Startowa"
          noDataMessage="Nie znaleziono zawodników. Zmień filtry lub wybierz inne zawody."
          data={data.filter((d) => d.categoryId === filterCatgoryId || filterCatgoryId === null)}
          refetching={loading}
          columns={columns(categories, roles)}
          onRefresh={onRefresh}
          cardBodyClassName="overflow-x-visible"
        />
      </div>
    </div>
  );
};

export default StartLists;
