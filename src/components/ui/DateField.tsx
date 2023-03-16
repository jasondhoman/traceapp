import { TextField } from '@mui/material';
import React, { Dispatch, FC, SetStateAction, useRef } from 'react';
import validator from 'validator';
import GridField from './GridField';

export interface DateType {
  error: boolean;
  helperText: string;
  value: string;
}

const DateField: FC<{
  label: string;
  date: DateType;
  onChange: Dispatch<SetStateAction<DateType>>;
}> = ({ label, date, onChange }) => {
  const inputEl = useRef<HTMLInputElement | null>(null);
  const [dateString, setDateString] = React.useState<string[]>([]);

  const handleDateChange = (e: React.SyntheticEvent) => {
    console.log(inputEl);
    if (inputEl && inputEl.current) {
      const index = inputEl.current.selectionStart;
      const value = inputEl.current.value;
      if (index && value) {
        console.log(index, value[index - 1]);
        const newDateString = dateString;
        newDateString[index - 1] = value[index - 1];
        setDateString(newDateString);
      }
    }
    const target = e.target as HTMLInputElement;
    const newDate = date;
    newDate.value = target.value;
    if (newDate.value !== '') {
      newDate.error = !validator.isDate(target.value, {
        format: 'MM-DD-YYYY',
      });
    } else {
      newDate.error = false;
    }
    onChange((prev) => {
      return { ...prev, newDate };
    });
  };

  return (
    <>
      <input
        type="text"
        ref={inputEl}
        onChange={handleDateChange}
        maxLength={15}
        value={dateString.join('')}
      />

      {'Date String' + dateString}
      <TextField
        error={date.error}
        helperText={date.error ? 'Enter a valid date' : ' '}
        placeholder="MM-DD-YYYY"
        id="begin_date"
        name="begin_date"
        margin="normal"
        label={label}
        inputProps={{
          maxLength: 10,
        }}
        onChange={handleDateChange}
      />
      <GridField
        size="auto"
        error={date.error}
        helperText={date.error ? 'Enter a valid date' : ' '}
        placeholder="MM-DD-YYYY"
        mask="   -   -"
        id="begin_date"
        name="begin_date"
        margin="normal"
        label={label}
        inputProps={{
          maxLength: 10,
        }}
        onChange={handleDateChange}
        value={date.value}
      />
      <input type="hidden" value={1} />
    </>
  );
};

export default DateField;
