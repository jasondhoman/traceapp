import React, { useContext } from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { StateContextType } from '../../@types/statecontext';
import { StateContext } from '../../context/StateContext';

interface ICheckbox {
  value: any;
  label: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom' | undefined;
  handleChange: () => void;
}

const CheckboxFragment: React.FC<ICheckbox> = ({
  value,
  label,
  labelPlacement = 'end',
  handleChange,
}) => {
  const { viewing } = useContext(StateContext) as StateContextType;
  return (
    <FormGroup aria-label="position" row>
      <FormControlLabel
        value={value}
        control={<Checkbox checked={value} />}
        label={label}
        labelPlacement={labelPlacement}
        onChange={() => handleChange()}
        disabled={viewing}
      />
    </FormGroup>
  );
};
export default CheckboxFragment;
