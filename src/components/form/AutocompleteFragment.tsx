//UI Components
import { Autocomplete, TextField } from '@mui/material';
//React
import React, { useContext, useEffect, useState } from 'react';

import { AutoComplete } from '../../@types/tracetypes';
import GridField from '../ui/GridField';
//Context
import { StateContext } from '../../context/StateContext';
//Types
import { has } from 'lodash';
import { StateContextType } from '../../@types/statecontext';

interface IAutocompleteFragment {
  selectOptions: any;
  state: any;
  changeState: (id: any) => void;
  label: string;
  id: string;
  viewingText?: string;
  onChange?: (e: React.SyntheticEvent) => void;
  none?: boolean;
  noneValue?: any;
  valColumn?: string;
  descColumn?: string;
  disabled?: boolean;
  name?: string;
  defaultType?: 'number' | 'string';
  helperText?: string;
  error?: boolean;
  filterOptions?: (options: any, state: any) => any;
  isOptionEqualToValue?: (option: any, value: any) => boolean;
}

const AutocompleteFragment: React.FC<IAutocompleteFragment> = ({
  selectOptions,
  state,
  changeState,
  onChange,
  label,
  id,
  none,
  noneValue,
  valColumn = 'value',
  descColumn = 'desc',
  disabled = false,
  name,
  defaultType = 'number',
  viewingText,
  helperText,
  error,
  isOptionEqualToValue,
  filterOptions,
}) => {
  const { viewing } = useContext(StateContext) as StateContextType;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [description, setDescription] = useState('');

  const OptionEqualityTest = (option: AutoComplete, value: AutoComplete) => {
    // console.log(option, value);
    return option.label === value.label || option.id === value.id;
  };

  const getOptionLabel = (option: any) => {
    if (typeof option === 'string') {
      return option;
    } else if (typeof option === 'number') {
      return option.toString();
    }
    if (has(option, 'label')) {
      return option.label;
    }
    if (has(option, 'tracking_id')) {
      return option.tracking_id.toString();
    }
    if (has(option, 'id')) {
      return option.id.toString();
    }
    return '';
  };

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
      value={viewingText}
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
    <Autocomplete
      disablePortal
      value={state}
      filterOptions={filterOptions ?? undefined}
      getOptionLabel={getOptionLabel}
      onChange={(_: any, newValue: any) => {
        if (newValue) {
          changeState(newValue.id);
        }
      }}
      options={selectOptions}
      renderInput={(params) => (
        <TextField
          error={error}
          helperText={helperText}
          {...params}
          label={label}
        />
      )}
      isOptionEqualToValue={isOptionEqualToValue ?? OptionEqualityTest}
    />
  );
};

export default AutocompleteFragment;
