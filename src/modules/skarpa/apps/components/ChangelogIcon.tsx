'use client';

import { MdOutlineAdd, MdRemove } from 'react-icons/md';
import { TbStatusChange, TbTool } from 'react-icons/tb';
import { LogType } from '../types';

type Props = {
  type: LogType;
};

const ChangelogIcon = ({ type }: Props) => {
  if (type === 'add') return <MdOutlineAdd className="text-green-900" size={20} />;
  if (type === 'remove') return <MdRemove className="text-red-900" size={20} />;
  if (type === 'fix') return <TbTool className="text-light-blue-900" size={20} />;
  return <TbStatusChange className="text-amber-900" size={20} />;
};

export default ChangelogIcon;
