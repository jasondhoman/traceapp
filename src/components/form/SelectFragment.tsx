import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import { StateContextType } from '../../@types/statecontext';
import { StateContext } from '../../context/StateContext';
import GridField from '../ui/GridField';

interface ISelectFragment {
  selectOptions: any;
  state: any;
  changeState: (e: SelectChangeEvent) => void;
  label: string;
  id: string;
  onChange?: (e: React.SyntheticEvent) => void;
  none?: boolean;
  noneValue?: any;
  valColumn?: string;
  descColumn?: string;
  disabled?: boolean;
  name?: string;
  defaultType?: 'number' | 'string';
  className?: string;
}

const SelectFragment: React.FC<ISelectFragment> = ({
  selectOptions,
  state,
  changeState,
  label,
  id,
  valColumn = 'value',
  descColumn = 'desc',
  disabled = false,
  name,
  defaultType = 'number',
  className,
}) => {
  const { viewing } = useContext(StateContext) as StateContextType;
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectOptions) {
      selectOptions.forEach((e: any) => {
        if (e[valColumn] === state) {
          setDescription(e[descColumn]);
        }
      });
    }
  }, [descColumn, selectOptions, state, valColumn]);

  return viewing ? (
    <GridField
      fullWidth
      className="px-1 my-0"
      margin="normal"
      id={id}
      label={label}
      value={description}
      inputProps={{ readOnly: true }}
      size={undefined}
      onChange={undefined}
      multiline={false}
      helperText={''}
      disabled={false}
      spacing={0}
      mask={''}
    />
  ) : (
    <FormControl
      fullWidth
      variant="outlined"
      className={className ? className : 'm-0'}
    >
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        id={id}
        label={label}
        value={state}
        onChange={(e) => changeState(e)}
        disabled={disabled}
        fullWidth
        name={name ?? ''}
      >
        <MenuItem key={-1} value={defaultType === 'number' ? 0 : ''}>
          Select {label}
        </MenuItem>
        {selectOptions.map((option: any, index: number) => (
          <MenuItem key={index.toString()} value={option[valColumn]}>
            {option[descColumn]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFragment;
