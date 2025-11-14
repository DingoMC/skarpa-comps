'use client';

import { CompetitionWithMemberCount } from '@/lib/types/competition';
import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardFrame from '@/modules/dashboard/components';
import NoData from '@/modules/lottie/NoData';
import SingleCompetition from './SingleCompetition';

type Props = {
  data: CompetitionWithMemberCount[];
  loading: boolean;
  onRefresh: () => Promise<void>;
};

const MainPage = ({ data, loading, onRefresh }: Props) => {
  return (
    <DashboardFrame
      title="Harmonogram wydarzeń"
      refreshing={loading}
      cardBodyClassName="flex flex-col gap-4"
      cardHeaderRight={<TemplateButton template="refresh" onClick={onRefresh} disabled={loading} message="Pobierz ponownie dane zawodów" />}
    >
      {data.map((d) => (
        <SingleCompetition key={d.id} data={d} loading={loading} />
      ))}
      {!data.length && <NoData message="Brak wydarzeń." />}
    </DashboardFrame>
  );
};

export default MainPage;
