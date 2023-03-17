import { Autocomplete, TextField } from '@mui/material';
import React, { FC } from 'react';

const ComboBox: FC<{
  options: string[];
  id: string;
  label: string;
  onChange: (val: string) => void;
  value: string;
  name: string;
  error: boolean;
  helperText?: string;
  inputProps?: object;
}> = ({
  options,
  id,
  label,
  onChange,
  value,
  name,
  error,
  helperText,
  inputProps,
}) => {
  // const [value, setValue] = useState<ComboBoxType | null>(null);

  return (
    options && (
      <Autocomplete
        fullWidth
        freeSolo
        id={id}
        value={value}
        onChange={(e: any, newValue: string) => {
          if (newValue) {
            console.log(e.target.name);
            onChange(newValue);
          }
        }}
        disableClearable
        options={options}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            name={name}
            error={error}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              type: 'search',
              ...inputProps,
            }}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        )}
      />
    )
  );
};

export default ComboBox;
