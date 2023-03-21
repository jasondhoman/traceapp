/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import { getDetailByID } from '../../pages/Misc/api/details';
import GridField from '../ui/GridField';

interface IStateSelect {
  state: any;
  changeState: (id: any) => void;
  size?: number;
  name?: string;
}

interface stateAutocomplete {
  id: string;
  label: string;
}

const StateSelect: React.FC<IStateSelect> = ({
  state,
  changeState,
  size = 16,
  name,
}) => {
  //Select States
  const [states, setStates] = useState<string[]>([]);
  // const [error, setError] = useState(false);
  const [selectedState, setSelectedState] = useState<stateAutocomplete>({
    id: '',
    label: '',
  });

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;

    // if (!states.includes(target.value)) {
    //   setError(true);
    // }
    changeState(target.value);
  };

  // const updateSelectedState = useCallback(
  //   (state: string) => {
  //     const s = states.find((c) => c.id === state);
  //     if (s) {
  //       setSelectedState(s);
  //       changeState(s.id);
  //     }
  //   },
  //   [states, changeState]
  // );

  useEffect(() => {
    getDetailByID(1).then((details) => {
      if (details) {
        const states = details.map((s: any) => s.value);
        setStates(states);
      }
    });
  }, [state]);

  return (
    <Grid item xs={size}>
      <GridField
        size="auto"
        id="state"
        label="State"
        // error={error}
        value={state}
        onChange={handleChange}
        fullWidth
        inputProps={{
          maxLength: 2,
        }}
        style={{ marginTop: '.5rem' }}
      />
      {/* <AutocompleteFragment
        id="state"
        label="State"
        state={selectedState}
        viewingText={selectedState.label}
        changeState={(id) => {
          if (id) {
            id = id.toUpperCase();
          }
          updateSelectedState(id);
          changeState(id);
        }}
        selectOptions={states}
      /> */}
    </Grid>
  );
};
export default StateSelect;
