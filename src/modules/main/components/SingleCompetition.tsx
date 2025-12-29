'use client';

import { Button, Typography } from '@/lib/mui';
import { CompetitionWithMemberCount } from '@/lib/types/competition';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

type Props = {
  data: CompetitionWithMemberCount;
  loading: boolean;
};

const SingleCompetition = ({ data, loading }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const isEnrollable = useMemo(() => {
    const now = new Date().getTime();
    return !data.lockEnroll && new Date(data.enrollStart).getTime() <= now && new Date(data.enrollEnd).getTime() >= now;
  }, [data]);
  const inProgress = useMemo(() => {
    const now = new Date().getTime();
    return new Date(data.startDate).getTime() <= now && new Date(data.endDate).getTime() >= now;
  }, [data]);
  const finished = useMemo(() => {
    const now = new Date().getTime();
    return new Date(data.endDate).getTime() < now;
  }, [data]);
  const upcoming = useMemo(() => {
    const now = new Date().getTime();
    return new Date(data.startDate).getTime() > now;
  }, [data]);

  const handleClickEnroll = () => {
    router.push(`/comp_signups?id=${data.id}`);
  };

  return (
    <div className="p-2 flex flex-col gap-2 border rounded-lg border-gray-400">
      <Typography className="text-xl font-semibold">{data.name}</Typography>
      <div className="flex gap-2 flex-wrap items-center">
        <Typography className="text-sm">
          {`${new Date(data.startDate).toLocaleDateString()} - ${new Date(data.endDate).toLocaleDateString()}`}
        </Typography>
        {upcoming && <div className="text-xs px-1 py-0.5 bg-gray-600 text-white rounded">Nadchodzące</div>}
        {inProgress && <div className="text-xs px-1 py-0.5 bg-green-700 text-white rounded">W trakcie</div>}
        {finished && <div className="text-xs px-1 py-0.5 bg-blue-700 text-white rounded">Zakończone</div>}
        {data.isInternal && <div className="text-xs px-1 py-0.5 bg-skarpa-600 text-white rounded">Wewnętrzne</div>}
      </div>
      <div className="flex gap-1 flex-wrap items-center">
        <Typography className="text-sm">Uczestnicy:</Typography>
        <div className="text-xs px-1.5 py-0.5 bg-gray-600 text-white rounded-lg font-semibold">{data.countAll}</div>
        <Typography className="text-sm font-semibold">-</Typography>
        <div
          className="flex gap-2 items-center text-xs px-1.5 py-0.5 text-white rounded-lg font-semibold"
          style={{ background: 'linear-gradient(110deg, #155dfc, #155dfc 35%, #e60076 65%, #e60076)' }}
        >
          <div>{data.countMen}</div>
          <div>/</div>
          <div>{data.countWomen}</div>
        </div>
      </div>
      {user !== null && data.alreadyEnrolled && (
        <div className="flex w-max items-center gap-1 text-xs px-1.5 py-0.5 bg-lime-700 text-white rounded font-semibold">
          <FaCheck />
          <span>{`Zapisał${user.gender ? 'e' : 'a'}ś się`}</span>
        </div>
      )}
      <div className="w-full h-px bg-gray-300" />
      <Typography className="text-sm italic text-gray-900 font-semibold">Opis:</Typography>
      {data.description !== null && data.description.length > 0 ? (
        <Typography className="text-sm text-gray-900">{data.description}</Typography>
      ) : (
        <Typography className="text-sm italic text-gray-600">Brak opisu.</Typography>
      )}
      <div className="w-full h-px bg-gray-300" />
      <div className="flex items-center justify-end gap-3">
        <Button size="sm" variant="gradient" color="info" disabled={loading}>
          Wyniki
        </Button>
        <Button size="sm" variant="gradient" color="secondary" disabled={loading}>
          Lista
        </Button>
        {isEnrollable && (user === null || !data.alreadyEnrolled) && (
          <Button size="sm" variant="gradient" color="success" disabled={loading} onClick={() => handleClickEnroll()}>
            Zapisz się
          </Button>
        )}
      </div>
    </div>
  );
};

export default SingleCompetition;
