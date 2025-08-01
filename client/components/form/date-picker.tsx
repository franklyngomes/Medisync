import Label from './Label';
import { useEffect, useState } from 'react';
import toLocalDateTimeString from '../../hooks/useDateTimeString';

type PropsType = {
  id: string;
  onChange?: (date: Date | null) => void;
  defaultDate?: Date;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  onChange,
  defaultDate,
  label,
  placeholder,
}: PropsType) {

  const [value, setValue] = useState<string | undefined>('');
  useEffect(() => {
    if (defaultDate) {
      const localString = toLocalDateTimeString(new Date(defaultDate));
      setValue(localString);
    }
  }, [defaultDate])

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue(value)
    if(onChange){
      const parsed = value ? new Date(value) : null;
      onChange(parsed)
    }
  }

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          id={id}
          type="datetime-local"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800 overflow-visible"
        />
      </div>
    </div>
  );
}
