import React, { useEffect, useState } from 'react';
import { AutoComplete, ISalesPerson } from '../../@types/tracetypes';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useQuery } from 'react-query';
import { getSalespersons } from '../../pages/Salespersons/api/salesperson';
import AutocompleteFragment from './AutocompleteFragment';

interface ISalespersonSelect {
  state: any;
  changeState: (id: number) => void;
  size?: number;
  name?: string;
}

const SalespersonSelect: React.FC<ISalespersonSelect> = ({
  state,
  changeState,
  size = 16,
  name,
}) => {
  const [selectedSalesperson, setSelectedSalesperson] = useState<AutoComplete>({
    id: 0,
    label: '',
  });
  const [salespersonAutocompletes, setSalesAutocompletes] = useState<
    AutoComplete[]
  >([]);

  const { isLoading, data: salespersons } = useQuery<ISalesPerson[]>(
    'sales_select',
    getSalespersons
  );

  useEffect(() => {
    if (salespersons) {
      const salespersonAutocompletes: AutoComplete[] = salespersons.map(
        (salesperson) => {
          return {
            id: salesperson.id,
            label: salesperson.name,
          };
        }
      );
      salespersonAutocompletes.unshift({
        id: 0,
        label: 'Select Salesperson',
      });
      const s = salespersonAutocompletes.find((c) => c.id === state);
      if (s) {
        setSelectedSalesperson(s);
      }
      setSalesAutocompletes(salespersonAutocompletes);
    }
  }, [salespersons, state]);

  return (
    <Grid item xs={size}>
      {!isLoading ? (
        <AutocompleteFragment
          id="salesperson-select"
          label="Salesperson"
          state={selectedSalesperson}
          viewingText={selectedSalesperson.label}
          changeState={changeState}
          selectOptions={salespersonAutocompletes}
        />
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
};
export default SalespersonSelect;
