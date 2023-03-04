import React from 'react';
import GridField from '../ui/GridField';

interface DateObject {
  error: boolean;
  helperText: string;
  value: string;
}

const DateInput: React.FC<{
  date: DateObject;
  handleDateChange: (e: React.SyntheticEvent) => void;
  name: string;
  label: string;
}> = ({ date, handleDateChange, name, label }) => {
  return (
    <GridField
      error={date.error}
      helperText={date.error ? 'Enter a valid date' : ' '}
      placeholder="MM-DD-YYYY"
      size="auto"
      className="px-2 my-0"
      id={name}
      name={name}
      margin="normal"
      label={label}
      inputProps={{
        maxLength: 10,
      }}
      onChange={handleDateChange}
      value={date.value}
    />
  );
};

export default DateInput;
