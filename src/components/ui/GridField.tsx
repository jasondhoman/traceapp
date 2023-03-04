import React, { useContext, useState } from 'react';

import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { StateContextType } from '../../@types/statecontext';
import { StateContext } from '../../context/StateContext';

interface IGridField {
  //Onchange is a handleChange when not using a mask else it should be set to the setState function for the object
  size: any;
  id: string;
  label: string;
  inputProps?: any;
  onChange?: (e: React.SyntheticEvent) => void | undefined;
  value?: any;
  fullWidth?: boolean;
  className?: string;
  variant?: 'outlined' | 'filled' | 'standard' | undefined;
  margin?: 'none' | 'normal' | 'dense' | undefined;
  multiline?: boolean;
  helperText?: string;
  disabled?: boolean;
  spacing?: number;
  mask?: string;
  name?: string | undefined;
  error?: boolean;
  component?: any;
  requiredInput?: boolean;
  placeholder?: string;
  numeric?: boolean;
  commas?: boolean;
  style?: object;
  setter?: React.Dispatch<React.SetStateAction<any>>;
  disableAutocomplete?: boolean;
  onBlur?: () => void;
}

const GridField: React.FC<IGridField> = ({
  size,
  id,
  label,
  inputProps,
  onChange,
  value,
  fullWidth,
  className,
  variant,
  margin,
  multiline,
  helperText,
  mask = '',
  name,
  error = false,
  component,
  requiredInput,
  placeholder,
  numeric,
  commas,
  style,
  setter,
  disableAutocomplete,
  onBlur,
}) => {
  const { viewing, setStaticValue } = useContext(
    StateContext
  ) as StateContextType;
  const [blankNumber, setNumberBlank] = useState(false);

  const SetMask = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    let v = '';
    const input_mask = mask.substring(0, target.value.length);
    const input_mask_stripped = mask.replace(/ /g, '');

    const s = new Set(input_mask_stripped.split(''));
    // remove all characters that are in the mask
    target.value.split('').forEach((c) => {
      if (!s.has(c)) {
        v += c;
      }
    });

    if (numeric) {
      v = v.replace(/[^0-9]/g, '');
    }

    if (!v.length) {
      if (setter) setStaticValue(target.name, '', setter);
      return;
    }
    let new_value = input_mask;
    const inputs = v.split('');
    while (inputs.length > 0) {
      const c = inputs.shift();
      if (c) {
        if (new_value.indexOf(' ') === -1) {
          new_value += c;
        } else {
          new_value = new_value.replace(' ', c);
        }
      }
    }

    new_value = new_value.replace(/ /g, '');

    if (setter) setStaticValue(target.name, new_value, setter);
  };

  const handleChange = (e: React.SyntheticEvent) => {
    if (mask) {
      SetMask(e);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <Grid item xs={size === 'auto' ? 'auto' : size} className="py-0 my-0">
      {component ? (
        component
      ) : (
        <TextField
          required={requiredInput ?? false}
          error={error}
          fullWidth={fullWidth ?? false}
          className={className}
          id={id}
          name={name ?? ''}
          margin={margin ?? 'normal'}
          placeholder={placeholder ?? ''}
          label={label}
          onChange={handleChange}
          value={blankNumber ? '' : commas ? value.toLocaleString() : value}
          multiline={multiline ?? false}
          helperText={helperText ?? ''}
          variant={variant ? variant : viewing ? 'filled' : 'outlined'}
          onBlur={onBlur && onBlur}
          inputProps={{
            ...inputProps,
            readOnly: viewing,
          }}
          style={style ?? {}}
          autoComplete={disableAutocomplete ? 'off' : 'on'}
        />
      )}
    </Grid>
  );
};

export default GridField;
