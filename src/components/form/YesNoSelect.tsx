import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React, { useContext } from 'react';

import Grid from '@mui/material/Grid';
import { StateContextType } from '../../@types/statecontext';
import { StateContext } from '../../context/StateContext';
import GridField from '../ui/GridField';

interface IYN {
  state: any;
  changeState: (e: SelectChangeEvent) => void;
  label: string;
  size?: number;
  id: string;
  name?: string;
}

const YesNoSelect: React.FC<IYN> = ({
  state,
  changeState,
  label,
  size = 16,
  id,
  name,
}) => {
  const { viewing } = useContext(StateContext) as StateContextType;
  return viewing ? (
    <GridField
      fullWidth
      size={size}
      className="px-1"
      margin="normal"
      id={id}
      label={label}
      value={state}
      inputProps={{ readOnly: true }}
    />
  ) : (
    <Grid item xs={6}>
      <FormControl fullWidth className="px-0 mx-0" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id={id}>{label}</InputLabel>
        <Select
          labelId={id}
          id={id}
          value={state}
          label={label}
          name={name ?? ''}
          onChange={(e) => changeState(e)}
        >
          <MenuItem value="Y">Yes</MenuItem>
          <MenuItem value="N">No</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

export default YesNoSelect;
