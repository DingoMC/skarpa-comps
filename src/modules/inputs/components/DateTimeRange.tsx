'use client';

import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const TIME_RANGE_MINUTE = 60 * 1000;

type Props = {
  begin: number;
  end: number;
  error?: boolean;
  disabled?: boolean;
  handleBeginChange: (value: number) => void;
  handleEndChange: (value: number) => void;
};

const InputDateTimeRange = ({ begin, end, error, disabled, handleBeginChange, handleEndChange }: Props) => {
  const onInputBegin = (v: Value) => {
    if (!Array.isArray(v) && v !== null) {
      let newBeginValue = v.getTime();
      if (newBeginValue > end) newBeginValue = end - TIME_RANGE_MINUTE;
      handleBeginChange(newBeginValue);
    }
  };

  const onInputEnd = (v: Value) => {
    if (!Array.isArray(v) && v !== null) {
      let newEndValue = v.getTime();
      if (newEndValue < begin) newEndValue = begin + TIME_RANGE_MINUTE;
      handleEndChange(newEndValue);
    }
  };

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <DateTimePicker
        className="[&>div]:rounded [&>div]:!border-gray-400 [&>div]:text-sm [&>div]:px-1"
        value={new Date(begin)}
        onChange={onInputBegin}
        clearIcon={null}
      />
      {'-'}
      <DateTimePicker
        value={new Date(end)}
        onChange={onInputEnd}
        className="[&>div]:rounded [&>div]:!border-gray-400 [&>div]:text-sm [&>div]:px-1"
        clearIcon={null}
      />
    </div>
  );
};

export default InputDateTimeRange;
