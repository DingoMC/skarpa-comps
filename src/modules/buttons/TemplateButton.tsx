'use client';

import { IconButton, Tooltip, Typography } from '@/lib/mui';
import { FaEdit } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { IoMdDownload } from 'react-icons/io';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import { TbRefresh } from 'react-icons/tb';

const templates = {
  refresh: {
    icon: <TbRefresh className="w-5 h-5 text-white" />,
    tooltip: 'Odśwież',
    color: 'secondary',
  },
  downloadCSV: {
    icon: <IoMdDownload className="w-5 h-5" />,
    tooltip: 'Pobierz CSV',
    color: 'secondary',
  },
  add: {
    icon: <FaPlus className="w-5 h-5 text-white" />,
    tooltip: 'Nowy...',
    color: 'secondary',
  },
  edit: {
    icon: <FaEdit className="w-4 h-4 text-gray-900" />,
    tooltip: 'Edytuj',
    color: 'primary',
  },
  delete: {
    icon: <FaEdit className="w-5 h-5 text-red-600" />,
    tooltip: 'Usuń',
    color: 'error',
  },
  back: {
    icon: <IoReturnUpBackOutline className="w-5 h-5 text-white" />,
    tooltip: 'Powrót',
    color: 'secondary',
  },
};

type Props = {
  template: keyof typeof templates;
  onClick?: (() => void) | (() => Promise<void>);
  disabled?: boolean;
  message?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'ghost' | 'outline' | 'solid' | 'gradient';
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  className?: `${string}`;
};

const TemplateButton = ({ template, onClick, disabled, size, message, variant, color, className }: Props) => (
  <Tooltip>
    <Tooltip.Trigger
      as={IconButton}
      onClick={() => {
        if (onClick !== undefined) onClick();
      }}
      size={size ?? 'sm'}
      variant={variant ?? 'ghost'}
      color={color ?? templates[template].color}
      className={`cursor-pointer ${className ?? ''}`}
      disabled={disabled}
    >
      {templates[template].icon}
    </Tooltip.Trigger>
    <Tooltip.Content>
      <Typography type="small">{message ?? templates[template].tooltip}</Typography>
      <Tooltip.Arrow />
    </Tooltip.Content>
  </Tooltip>
);

export default TemplateButton;
