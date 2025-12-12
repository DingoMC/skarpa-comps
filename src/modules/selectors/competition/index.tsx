'use client';

import { getAllCompetitionsAdmin } from '@/modules/admin/competitions/requests';
import { setCurrentCompId } from '@/store/slices/competition';
import { RootState } from '@/store/store';
import { Competition } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CompetitionSelector from './CompetitionSelector';

const CompetitionSelectorWrapper = () => {
  const currCompId = useSelector((state: RootState) => state.competition.id);
  const [data, setData] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const loadData = async () => {
    const resp = await getAllCompetitionsAdmin();
    if (resp.error !== null) {
      toast.error(resp.error);
      setData([]);
    } else {
      setData(resp.data);
      if ((!currCompId || !resp.data.map((v) => v.id).includes(currCompId)) && resp.data.length) {
        dispatch(setCurrentCompId(resp.data[0].id));
      }
    }
    setLoading(false);
  };

  const handleCompChange = (id: string) => {
    dispatch(setCurrentCompId(id));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return null;

  return <CompetitionSelector data={data} currentId={currCompId} onChange={handleCompChange} />;
};

export default CompetitionSelectorWrapper;
