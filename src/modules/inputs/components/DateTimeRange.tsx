'use client';

const TIME_RANGE_MINUTE = 60 * 1000;

function timestampToDateTimeString(timestamp: number) {
  const tzOffset = new Date().getTimezoneOffset();
  const date = new Date(timestamp - tzOffset * 60000);
  const str = date.toISOString();
  return str.slice(0, 16);
}

type Props = {
  begin: number;
  end: number;
  error?: boolean;
  disabled?: boolean;
  handleBeginChange: (value: number) => void;
  handleEndChange: (value: number) => void;
};

const InputDateTimeRange = ({ begin, end, error, disabled, handleBeginChange, handleEndChange }: Props) => {
  const getUTCTimestamp = (date: Date) => date.getTime();

  const onInputBegin = (v: string) => {
    const inputBeginValue = getUTCTimestamp(new Date(v));
    let newBeginValue = inputBeginValue;
    if (newBeginValue > end) newBeginValue = end - TIME_RANGE_MINUTE;
    handleBeginChange(newBeginValue);
  };

  const onInputEnd = (v: string) => {
    const inputEndValue = getUTCTimestamp(new Date(v));
    let newEndValue = inputEndValue;
    if (newEndValue < begin) newEndValue = begin + TIME_RANGE_MINUTE;
    handleEndChange(newEndValue);
  };

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <input
        type="datetime-local"
        className={`text-xs p-2 border rounded border-gray-300 focus:border-gray-800
          outline-none ${error ? '!border-red-600 !text-red-600' : ''}`}
        disabled={disabled}
        value={timestampToDateTimeString(begin)}
        onChange={(v) => onInputBegin(v.target.value)}
      />
      {'-'}
      <input
        type="datetime-local"
        className={`text-xs p-2 border rounded border-gray-300 focus:border-gray-800
          outline-none ${error ? '!border-red-600 !text-red-600' : ''}`}
        disabled={disabled}
        value={timestampToDateTimeString(end)}
        onChange={(v) => onInputEnd(v.target.value)}
      />
    </div>
  );
};

export default InputDateTimeRange;
