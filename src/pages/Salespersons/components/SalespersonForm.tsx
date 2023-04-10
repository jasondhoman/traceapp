import { Grid, Paper } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';
import { ReducerActionType, SetPageState } from '../../../utils/reducers';
import { addSalesperson, updateSalesperson } from '../api/salesperson';

import { AxiosResponse } from 'axios';
import { useQueryClient } from 'react-query';
import { AuthContextType } from '../../../@types/authcontext';
import { StateContextType } from '../../../@types/statecontext';
import { ISalesPersonFormData } from '../../../@types/tracetypes';
import ContactForm from '../../../components/form/ContactForm';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
import { default_salesperson } from '../../../utils/constants';

interface ISalesPersonsEdit {
  reducer: React.Dispatch<SetPageState>;
  prop_salesperson?: ISalesPersonFormData;
  id?: number | null;
}

const SalepersonsEdit: React.FC<ISalesPersonsEdit> = ({
  reducer,
  prop_salesperson,
  id,
}) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { setLoading, handleChange } = useContext(
    StateContext
  ) as StateContextType;
  const [isUpdate, setIsUpdate] = useState(false);
  const [salesperson, setSalesperson] =
    useState<ISalesPersonFormData>(default_salesperson);

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<ISalesPersonFormData>('salesperson');

  const addSalespersonMutation = useQueryMutation({
    mutator: addSalesperson,
    method: 'POST',
    query: 'salespersons',
    errorClosure: (error: AxiosResponse<any, any>) => {
      if (error.status === 200 && !isUpdate) {
        reducer({
          type: ReducerActionType.CANCEL,
          payload: {
            tablabel: 'Add New',
            tab_id: 1,
            id: null,
            disabled: false,
          },
        });
      }
    },
  });

  const updateSalespersonMutation = useQueryMutation({
    mutator: updateSalesperson,
    method: 'PUT',
    query: 'salespersons',
  });

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...salesperson,
      commission: parseFloat(salesperson.commission.toString()),
      salesperson_id: isUpdate ? prop_salesperson?.id : null,
      user_id: user?.id,
    };

    if (isUpdate) {
      updateSalespersonMutation.mutate(data);
    } else {
      addSalespersonMutation.mutate(data);
    }
  };

  const ClearForm = () => {
    setSalesperson(default_salesperson);
  };

  useMemo(() => {
    if (data) {
      setIsUpdate(true);
      setSalesperson({
        ...data,
      });
    }
  }, [data]);

  setLoading(false);

  return (
    <Paper
      component="form"
      elevation={0}
      variant="outlined"
      onSubmit={submitForm}
      className="p-3 w-100"
    >
      <Grid
        container
        direction="row"
        wrap="nowrap"
        justifyContent="space-around"
        alignContent="center"
      >
        <Grid item>
          <TitleFragment size="h3" title="Salesperson" firstDivider={false} />
          <ContactForm
            state={salesperson}
            setter={setSalesperson}
            contactType="Salesperson"
            className="ps-3"
            address
            phone
            email
          />
        </Grid>
      </Grid>

      <GridField
        size={4}
        id="commission_rate"
        name="commission"
        label="Commission Rate"
        onChange={(e: React.SyntheticEvent) => handleChange(e, setSalesperson)}
        value={salesperson.commission}
        inputProps={{ type: 'number', step: '.01', max: '.99999' }}
        fullWidth
      />

      <GridField
        size={16}
        multiline
        fullWidth
        id="notes"
        name="notes"
        margin="normal"
        label="Notes"
        inputProps={{ maxLength: 500 }}
        onChange={(e: React.SyntheticEvent) => handleChange(e, setSalesperson)}
        value={salesperson.notes}
        helperText="Press Enter to Add New Line"
      />

      <FormButtons isUpdate={isUpdate} reducer={reducer} clear={ClearForm} />
    </Paper>
  );
};

export default SalepersonsEdit;
