import React, { useContext, useEffect, useState } from 'react';
import { addCustomer, updateCustomer } from '../api/customer';

import { SelectChangeEvent } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import { AuthContextType } from '../../../@types/authcontext';
import { StateContextType } from '../../../@types/statecontext';
import { ICustomerForm } from '../../../@types/tracetypes';
import CertificateSelect from '../../../components/form/CertificateSelect';
import SalespersonSelect from '../../../components/form/SalespersonSelect';
import YesNoSelect from '../../../components/form/YesNoSelect';
import CheckboxFragment from '../../../components/ui/CheckboxFragment';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
import { default_customer } from '../../../utils/constants';
import { useCustomerContext } from '../context/Customer.Context';

const CustomerGeneral: React.FC<ICustomerForm> = ({
  setTabState,
  setValue,
  reducer,
  id,
}) => {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { setLoading, handleSelectChange, setStaticValue } = useContext(
    StateContext
  ) as StateContextType;

  const { user } = useContext(AuthContext) as AuthContextType;
  const {
    context_customer,
    isUpdate,
    setIsUpdate,
    setCustomerID,
    setContextCustomer,
    resetCustomerContext,
  } = useCustomerContext();

  const [customer, setCustomer] = useState(
    context_customer ?? default_customer
  );

  const handleChangeText = (e: React.SyntheticEvent) => {
    setDisableSubmit(false);
    const target = e.target as HTMLInputElement;
    setCustomer((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const handleChangeNum = (e: React.SyntheticEvent) => {
    setDisableSubmit(false);
    const target = e.target as HTMLInputElement;
    try {
      const value = Number(target.value);
      setCustomer((prev) => {
        return { ...prev, [target.name]: value };
      });
    } catch (error) {
      enqueueSnackbar('Please enter a number', { variant: 'error' });
    }
  };

  const handleSelectWrapper = (e: SelectChangeEvent) => {
    setDisableSubmit(false);
    handleSelectChange(e, setCustomer);
  };

  const setSalesperson = (id: number) => {
    setStaticValue('salesperson', id, setCustomer);
  };
  const updateCustomerMutation = useQueryMutation({
    mutator: updateCustomer,
    method: 'PUT',
    query: 'customers',
    cleanClosure: (data: AxiosResponse) => {
      const res = data as AxiosResponse;
      if (res.status === 200) {
        setContextCustomer((prev) => {
          return { prev, ...customer };
        });
      }
    },
  });

  const addCustomerMutation = useQueryMutation({
    mutator: addCustomer,
    method: 'POST',
    query: 'customers',
    cleanClosure: (data: AxiosResponse) => {
      const res = data as AxiosResponse<{
        customer_id: number;
        message: string;
      }>;

      if (res.status === 200) {
        setCustomerID(res.data.customer_id);
        setContextCustomer((prev) => {
          return { ...prev, id: res.data.customer_id, ...customer };
        });
        setTabState(false);
        setValue(null, 2);
      }
    },
  });
  const submitForm = async (e: React.SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const data = {
        ...customer,
        customer_id: context_customer?.id,
        user_id: user?.id,
      };

      if (isUpdate) {
        updateCustomerMutation.mutate(data);
      } else {
        addCustomerMutation.mutate(data);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error: ' + error, { variant: 'error' });
    } finally {
      setContextCustomer((prev) => {
        return { ...prev, ...customer };
      });
    }
    setLoading(false);
  };

  const ClearForm = () => {
    setCustomer(default_customer);
  };

  useEffect(() => {
    setLoading(true);
    if (id) {
      setIsUpdate(true);
      setCustomerID(id);
    }
    setLoading(false);
  }, [id, setCustomerID, setIsUpdate, setContextCustomer, setLoading]);

  useEffect(() => {
    if (context_customer) {
      setCustomer(context_customer);
    }
  }, [context_customer]);

  return (
    <Grid
      component="form"
      onSubmit={submitForm}
      container
      direction="row"
      justifyContent="space-center"
      alignItems="center"
      columnSpacing={2}
      rowSpacing={1}
      columns={16}
      className="p-3 w-100"
    >
      <Grid item xs={16}>
        <TitleFragment
          size="h3"
          title="General Information"
          firstDivider={false}
        />
      </Grid>
      <GridField
        size={16}
        id="company_name"
        name="company_name"
        label="Company Name"
        onChange={handleChangeText}
        value={customer.company_name}
        inputProps={{ maxLength: 55 }}
        fullWidth
      />
      <GridField
        size={8}
        id="transport"
        name="transport"
        label="Transportation"
        onChange={handleChangeText}
        value={customer.transport}
        inputProps={{ maxLength: 30 }}
        fullWidth
      />

      <GridField
        size={8}
        id="transport_cost"
        name="transport_cost"
        label="Transport Cost"
        onChange={handleChangeNum}
        value={customer.transport_cost}
        inputProps={{ maxLength: 10, type: 'number', step: '.00001', min: 0 }}
        fullWidth
      />
      <GridField
        size={16}
        multiline
        fullWidth
        id="info_for_trucker"
        name="info_for_trucker"
        label="Info For Trucker"
        inputProps={{ maxLength: 500 }}
        onChange={handleChangeText}
        helperText="Press Enter to Add New Line"
        value={customer.info_for_trucker}
      />
      <Grid
        container
        style={{ paddingLeft: '1rem' }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <CertificateSelect
          id={customer.certification}
          changeState={handleSelectWrapper}
          size={5}
        />
        <YesNoSelect
          state={customer.c_of_a}
          changeState={handleSelectWrapper}
          label="C OF A"
          id="c_of_a"
          name="c_of_a"
          size={4}
        />
      </Grid>
      <YesNoSelect
        state={customer.factor}
        label="Factor"
        id="factor"
        name="factor"
        changeState={handleSelectWrapper}
        size={8}
      />

      <GridField
        size={8}
        id="terms"
        name="terms"
        label="Terms"
        onChange={handleChangeText}
        value={customer.terms}
        inputProps={{ maxLength: 20 }}
        fullWidth
      />
      <Grid item xs={4}>
        <CheckboxFragment
          value={customer.cod_sales}
          label="COD Sales"
          handleChange={() =>
            setStaticValue('cod_sales', !customer.cod_sales, setCustomer)
          }
        />
      </Grid>
      <Grid item xs={4}>
        <CheckboxFragment
          value={customer.active_disc}
          label="Less"
          handleChange={() =>
            setStaticValue('active_disc', !customer.active_disc, setCustomer)
          }
        />
      </Grid>
      <GridField
        disabled={!customer.active_disc}
        size={4}
        id="discount"
        name="discount"
        label="Discount"
        onChange={handleChangeNum}
        value={customer.discount}
        inputProps={{
          maxLength: 3,
          type: 'number',
          step: '.001',
          min: 0,
          max: 0.999,
        }}
        fullWidth
      />
      <GridField
        disabled={!customer.active_disc}
        size={4}
        id="num_of_invoices"
        name="num_of_invoices"
        label="Invoices to Print"
        onChange={handleChangeNum}
        value={customer.num_of_invoices}
        inputProps={{
          maxLength: 3,
          type: 'number',
          step: '1',
          min: 0,
          max: 999,
        }}
        fullWidth
      />
      <SalespersonSelect
        name="salesperson"
        state={customer.salesperson}
        changeState={setSalesperson}
      />
      <GridField
        size={16}
        multiline
        fullWidth
        id="customer_information"
        name="customer_information"
        margin="normal"
        label="Customer Information"
        inputProps={{ maxLength: 500 }}
        onChange={handleChangeText}
        value={customer.customer_information}
        helperText="Press Enter to Add New Line"
      />
      <GridField
        size={16}
        multiline
        fullWidth
        id="loading_instructions"
        name="loading_instructions"
        margin="normal"
        label="Loading Instructions"
        inputProps={{ maxLength: 500 }}
        onChange={handleChangeText}
        value={customer.loading_instructions}
        helperText="Press Enter to Add New Line"
      />
      <FormButtons
        isUpdate={isUpdate}
        reducer={reducer}
        clear={ClearForm}
        cancelEditClean={resetCustomerContext}
        disableSubmit={disableSubmit}
      />
    </Grid>
  );
};

export default CustomerGeneral;
