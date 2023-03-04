import React, { useEffect } from 'react';

import Grid from '@mui/material/Grid';
import { AutoComplete } from '../../@types/tracetypes';
import { getCustomerTags } from '../../pages/Customersize/api/customersize';
import AutocompleteFragment from './AutocompleteFragment';

interface ICustomerTagSelectType {
  state: any;
  changeState: (id: number) => void;
  size: number;
  customer_id: number;
  grade: string;
  disabled?: boolean;
}

const CustomerTagSelect: React.FC<ICustomerTagSelectType> = ({
  state,
  changeState,
  size = 16,
  customer_id,
  disabled = false,
  grade,
}) => {
  const [tags, setTags] = React.useState<AutoComplete[]>([]);

  const handleTagSelectChange = (id: number) => {
    if (id > 0) {
      changeState(id ?? '');
    }
  };

  useEffect(() => {
    if (customer_id && grade) {
      getCustomerTags(customer_id, grade).then((res) => {
        setTags(res);
      });
    }
  }, [customer_id, grade]);

  return (
    <Grid item xs={size}>
      <AutocompleteFragment
        id="tag-size-select"
        label="Tag Size"
        state={state}
        viewingText={state}
        changeState={handleTagSelectChange}
        selectOptions={tags}
        isOptionEqualToValue={(option: AutoComplete, value: string) =>
          option.label === state
        }
      />

      {/* <SelectFragment
        selectOptions={tags ?? []}
        state={state}
        changeState={changeState}
        label="Tag Size"
        id="tag-size"
        name="tag_size"
        none={true}
        noneValue="No A"
        valColumn="id"
        descColumn="tag_size"
        disabled={disabled ? true : viewing ? true : false}
      /> */}
    </Grid>
  );
};
export default CustomerTagSelect;
