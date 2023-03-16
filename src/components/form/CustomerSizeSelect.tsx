import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import { AutoComplete } from '../../@types/tracetypes';
import { getCustomerSizeByCustomer } from '../../pages/Customersize/api/customersize';
import AutocompleteFragment from './AutocompleteFragment';

interface ICustomerSizeSelectType {
  state: string | number;
  changeState: (id: string) => Promise<void>;
  size: number;
  customer_id: number;
  disabled?: boolean;
}

const CustomerSizeSelect: React.FC<ICustomerSizeSelectType> = ({
  state,
  changeState,
  size = 16,
  customer_id,
  disabled = false,
}) => {
  //Select States

  const [selectedGrade, setSelectedGrade] = useState<AutoComplete>({
    id: 0,
    label: '',
  });
  const [grades, setGrades] = React.useState<AutoComplete[]>([]);

  const handleGradeSelectChange = (id: string) => {
    changeState(id ?? '');
    const selected = grades.find((c) => c.label === id);

    if (selected) {
      setSelectedGrade(() => selected);
    }
  };

  useEffect(() => {
    if (customer_id) {
      getCustomerSizeByCustomer(customer_id).then((res) => {
        const g = res.map((c: AutoComplete) => {
          return { id: c.label, label: c.label };
        });
        g.unshift({ id: '', label: 'Select Grade' });
        setGrades(g);
        const selected = g.find(
          (c: { id: number; label: string }) => c.id === state
        );

        if (selected) {
          setSelectedGrade(() => selected);
        }
      });
    }
  }, [customer_id, state]);

  return (
    <Grid item xs={size}>
      <AutocompleteFragment
        id="grade-size-select"
        label="Grade Mix"
        state={state}
        viewingText={selectedGrade.label}
        changeState={handleGradeSelectChange}
        selectOptions={grades}
        isOptionEqualToValue={(option: AutoComplete, value: string) =>
          option.id === state
        }
      />
    </Grid>
  );
};
export default CustomerSizeSelect;
