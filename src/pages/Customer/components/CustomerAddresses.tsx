import React, { useContext, useEffect, useState } from 'react';
import { addShippingBilling, updateShippingBilling } from '../api/customer';

import Grid from '@mui/material/Grid';
import { AxiosResponse } from 'axios';
import { AuthContextType } from '../../../@types/authcontext';
import { StateContextType } from '../../../@types/statecontext';
import { ICustomerForm } from '../../../@types/tracetypes';
import ContactForm from '../../../components/form/ContactForm';
import FormButtons from '../../../components/ui/FormButtons';
import TitleFragment from '../../../components/ui/TitleFragment';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
import { default_contact } from '../../../utils/constants';
import { useCustomerContext } from '../context/Customer.Context';

const CustomerAddresses: React.FC<ICustomerForm> = ({
  setTabState,
  setValue,
  reducer,
}) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { setLoading } = useContext(StateContext) as StateContextType;
  const {
    context_customer,
    setContextCustomer,
    customer_id,
    isUpdate,
    resetCustomerContext,
  } = useCustomerContext();

  const [billingAddress, setBillingAddress] = useState(default_contact);
  const [shippingAddress, setShippingAddress] = useState(default_contact);

  const updateShipBillMutation = useQueryMutation({
    mutator: updateShippingBilling,
    method: 'PUT',
    query: 'customers',
  });

  const addShipBillMutation = useQueryMutation({
    mutator: addShippingBilling,
    method: 'POST',
    query: 'customers',
    errorClosure: (error: AxiosResponse<any, any>) => {
      if (error?.status === 200) {
        setTabState(false);
        if (!isUpdate) setValue(null, 3);
      }
    },
  });

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      shipping_address: {
        ...shippingAddress,
        id: context_customer?.shipping_address,
      },

      billing_address: {
        ...billingAddress,
        id: context_customer?.billing_address,
      },
      user_id: user?.id,
      customer_id: context_customer?.id,
    };

    if (isUpdate) {
      updateShipBillMutation.mutate(body);
    } else {
      addShipBillMutation.mutate(body);
    }
    setContextCustomer((prev) => {
      return {
        ...prev,
        billing_address_data: body.billing_address,
        shipping_address_data: body.shipping_address,
      };
    });
  };

  const ClearForm = () => {
    setShippingAddress(default_contact);
    setBillingAddress(default_contact);
  };

  useEffect(() => {
    if (context_customer.shipping_address_data) {
      setShippingAddress({ ...context_customer.shipping_address_data });
    }
    if (context_customer.billing_address_data) {
      setBillingAddress({ ...context_customer.billing_address_data });
    }
  }, [customer_id, context_customer]);
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
      <Grid
        container
        direction="row"
        wrap="nowrap"
        className="ms-1"
        justifyContent="space-around"
        alignContent="center"
        spacing={4}
      >
        <Grid item>
          <TitleFragment
            size="h3"
            title="Shipping Address"
            firstDivider={false}
          />
          <ContactForm
            state={shippingAddress}
            setter={setShippingAddress}
            contactType="ShippingContact"
            address
            phone
            ext
            fax
          />
        </Grid>
        <Grid item>
          <TitleFragment
            size="h3"
            title="Billing Address"
            firstDivider={false}
          />
          <ContactForm
            state={billingAddress}
            setter={setBillingAddress}
            contactType="BillingAddress"
            address
            phone
            ext
            fax
          />
        </Grid>
      </Grid>
      <FormButtons
        isUpdate={isUpdate}
        reducer={reducer}
        clear={ClearForm}
        cancelEditClean={resetCustomerContext}
      />
    </Grid>
  );
};

export default CustomerAddresses;
