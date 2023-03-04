import { Checkbox, FormControlLabel, Grid, Paper } from '@mui/material';
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { ReducerActionType, SetPageState } from '../../../utils/reducers';
import { createCreditMemo, updateCreditMemo } from '../api/creditmemo';

import { AxiosResponse } from 'axios';
import { useQueryClient } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import { ICreditMemoFormData } from '../../../@types/tracetypes';
import CustomerSelect from '../../../components/form/CustomerSelect';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
import { default_credit_memo } from '../../../utils/Constants';
import { getCustomer } from '../../Customer/api/customer';

interface ICreditMemoForm {
  reducer: React.Dispatch<SetPageState>;
  prop_credit_memo?: ICreditMemoFormData;
  id?: number | null;
}

const CreditMemoForm: React.FC<ICreditMemoForm> = ({
  reducer,
  prop_credit_memo,
  id,
}) => {
  const [customer_id, setCustomerID] = useState(0);

  const { setLoading, setStaticValue, handleChange } = useContext(
    StateContext
  ) as StateContextType;
  const [isUpdate, setIsUpdate] = useState(false);
  const [creditmemo, setCreditMemo] =
    useState<ICreditMemoFormData>(default_credit_memo);

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<ICreditMemoFormData>('memo');

  const updateMemoMutation = useQueryMutation({
    mutator: updateCreditMemo,
    method: 'PUT',
    query: 'creditmemos',
  });

  const createMemoMutation = useQueryMutation({
    mutator: createCreditMemo,
    method: 'POST',
    query: 'creditmemos',
    errorClosure: (error: AxiosResponse<any, any>) => {
      if (error?.status === 200) {
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

  const handleCustomerSelect = async (id: number) => {
    setCustomerID(0);
    if (!id) return;

    const res = await getCustomer(id);

    if (res.data) {
      setCustomerID(id);
      setStaticValue('customer', res.data.company_name, setCreditMemo);
      setStaticValue('customer_id', res.data.id, setCreditMemo);
    }
  };

  const handleSwitch = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setStaticValue(target.name, target.checked, setCreditMemo);
  };

  const submitForm = async (e: React.SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();

    const data = {
      ...creditmemo,
      tracking: Number(creditmemo.tracking),
      qty: Number(creditmemo.qty),
      pack_set: Number(creditmemo.pack_set),
      pack_bundle: Number(creditmemo.pack_bundle),
      credit_weight: Number(creditmemo.credit_weight),
      price_in_lbs: Number(creditmemo.price_in_lbs),
      price_per: Number(creditmemo.price_per),
      credit_amount: Number(creditmemo.credit_amount),
      reference_invoice: Number(creditmemo.reference_invoice),
      reference_bol: Number(creditmemo.reference_bol),
      memo_id: isUpdate ? creditmemo?.id : null,
    };
    if (isUpdate) {
      updateMemoMutation.mutate(data);
      queryClient.setQueryData('memo', creditmemo);
    } else {
      createMemoMutation.mutate(data);
    }
  };

  const ClearForm = () => {
    setCreditMemo(default_credit_memo);
    setCustomerID(0);
  };

  const handleDateChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.value === '' || target.value === undefined) return;
    setStaticValue(target.name, new Date(target.value), setCreditMemo);
  };

  const handleChangeWrapper = (e: React.SyntheticEvent) => {
    handleChange(e, setCreditMemo);
  };

  useEffect(() => {
    if (data) {
      setIsUpdate(true);
      setCreditMemo({
        ...data,
        order_date: new Date(data.order_date),
        ship_date: new Date(data.ship_date),
      });
      setCustomerID(data.customer_id);
    }
    setLoading(false);
  }, []);

  return (
    <Paper
      component="form"
      variant="outlined"
      onSubmit={submitForm}
      className="p-3 w-100"
    >
      <Grid
        container
        direction="row"
        justifyContent="space-center"
        alignItems="center"
        columnSpacing={2}
        rowSpacing={1}
        columns={16}
      >
        <Grid item xs={16}>
          <TitleFragment
            size="h3"
            title="Credit Memo Form"
            firstDivider={false}
          />
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          className="px-2 mx-1 my-1"
        >
          <GridField
            size="auto"
            className="px-1 my-0"
            id="order_date"
            name="order_date"
            margin="normal"
            label="Order Date"
            inputProps={{
              maxLength: 10,
              type: 'date',
              min: '1950-01-01',
              max: '2222-12-31',
            }}
            onChange={handleDateChange}
            value={creditmemo.order_date.toISOString().split('T')[0]}
          />
          <GridField
            size="auto"
            className="my-0"
            id="ship_date"
            name="ship_date"
            margin="normal"
            label="Shipping Date"
            inputProps={{
              maxLength: 10,
              type: 'date',
              min: '1950-01-01',
              max: '2222-12-31',
            }}
            onChange={handleDateChange}
            value={creditmemo.ship_date.toISOString().split('T')[0]}
          />
        </Grid>
        <GridField
          size={4}
          id="tracking"
          name="tracking"
          label="Tracking Number"
          inputProps={{ maxLength: 50 }}
          onChange={handleChangeWrapper}
          value={creditmemo.tracking}
          fullWidth
          disabled={true}
          className="text-black"
        />
        <GridField
          size={4}
          id="purchase_order"
          name="purchase_order"
          label="Purchase Order"
          inputProps={{ maxLength: 50 }}
          onChange={handleChangeWrapper}
          value={creditmemo.purchase_order}
          fullWidth
        />
        <GridField
          size={4}
          id="reference_bol"
          name="reference_bol"
          label="REF BOL"
          inputProps={{ maxLength: 50 }}
          onChange={handleChangeWrapper}
          value={creditmemo.reference_bol}
          fullWidth
        />
        <GridField
          size={4}
          id="reference_invoice"
          name="reference_invoice"
          label="REF Invoice"
          inputProps={{ maxLength: 50 }}
          onChange={handleChangeWrapper}
          value={creditmemo.reference_invoice}
          fullWidth
        />

        <CustomerSelect
          id={customer_id}
          changeState={handleCustomerSelect}
          size={16}
        />

        <GridField
          size={16}
          id="grade"
          name="grade"
          margin="normal"
          label="Grade"
          onChange={handleChangeWrapper}
          value={creditmemo.grade}
          inputProps={{ maxLength: 150 }}
          fullWidth
        />
        <GridField
          size={4}
          id="tag_size"
          name="tag_size"
          margin="normal"
          label="Tag Size"
          onChange={handleChangeWrapper}
          value={creditmemo.tag_size}
          fullWidth
        />

        <GridField
          fullWidth
          size={2}
          id="qty"
          name="qty"
          margin="normal"
          label="QTY"
          onChange={handleChangeWrapper}
          value={creditmemo.qty}
          inputProps={{
            maxLength: 10,
            type: 'number',
            step: '.00001',
          }}
        />

        <GridField
          size={2}
          className="px-1"
          id="pack_set"
          name="pack_set"
          margin="normal"
          label="Pack Set"
          onChange={handleChangeWrapper}
          value={creditmemo.pack_set}
          inputProps={{
            maxLength: 6,
            type: 'number',
            step: '.00001',
            min: 0,
          }}
        />

        <GridField
          size={2}
          className="px-1"
          id="pack_bundle"
          name="pack_bundle"
          margin="normal"
          label="Pack Bundle"
          onChange={handleChangeWrapper}
          value={creditmemo.pack_bundle}
          inputProps={{
            maxLength: 6,
            type: 'number',
            step: '.00001',
            min: 0,
          }}
        />

        <GridField
          size={2}
          className="px-1"
          id="price_per"
          name="price_per"
          margin="normal"
          label="Price Per"
          onChange={handleChangeWrapper}
          value={creditmemo.price_per}
          inputProps={{
            maxLength: 6,
            type: 'number',
            step: '.00001',
            min: 0,
          }}
        />

        <GridField
          size={2}
          className="px-1"
          id="price_in_lbs"
          name="price_in_lbs"
          margin="normal"
          label="Price LBS"
          onChange={handleChangeWrapper}
          value={creditmemo.price_in_lbs}
          inputProps={{
            maxLength: 6,
            type: 'number',
            step: '.00001',
            min: 0,
          }}
        />
        <GridField
          size={3}
          className="px-1"
          id="credit_weight"
          name="credit_weight"
          margin="normal"
          label="Credit Weight"
          onChange={handleChangeWrapper}
          value={creditmemo.credit_weight}
          inputProps={{
            maxLength: 6,
            type: 'number',
            step: '.00001',
            min: 0,
          }}
        />
        <GridField
          size={3}
          className="px-1"
          id="credit_amount"
          name="credit_amount"
          margin="normal"
          label="Credit Amount"
          onChange={handleChangeWrapper}
          value={creditmemo.credit_amount}
          inputProps={{
            maxLength: 6,
            type: 'number',
            step: '.00001',
            min: 0,
          }}
        />
        <GridField
          size={3}
          className="px-1"
          id="terms"
          name="terms"
          margin="normal"
          label="Terms"
          onChange={handleChangeWrapper}
          value={creditmemo.terms}
        />
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Checkbox
                name="used"
                checked={creditmemo?.used ? creditmemo.used : false}
                value={creditmemo?.used}
                onChange={(e: React.SyntheticEvent) => handleSwitch(e)}
              />
            }
            label="Credit Used"
          />
        </Grid>

        <FormButtons isUpdate={isUpdate} reducer={reducer} clear={ClearForm} />
      </Grid>
    </Paper>
  );
};

export default CreditMemoForm;
