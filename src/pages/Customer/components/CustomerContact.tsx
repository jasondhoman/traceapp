import React, { useContext, useEffect, useState } from 'react';
import { addContact, updateContact } from '../api/customer';

import Grid from '@mui/material/Grid';
import { AxiosResponse } from 'axios';
import { AuthContextType } from '../../../@types/authcontext';
import { CustomerContextType } from '../../../@types/customercontext';
import { StateContextType } from '../../../@types/statecontext';
import { ICustomerForm } from '../../../@types/tracetypes';
import ContactForm from '../../../components/form/ContactForm';
import FormButtons from '../../../components/ui/FormButtons';
import TitleFragment from '../../../components/ui/TitleFragment';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
import { default_contact } from '../../../utils/Constants';
import { CustomerContext } from '../context/Customer.Context';

const CustomerContact: React.FC<ICustomerForm> = ({
  setTabState,
  setValue,
  id,
  reducer,
  prop_customer,
}) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { setLoading } = useContext(StateContext) as StateContextType;

  const {
    customer_id,
    isUpdate,
    context_customer,
    setContextCustomer,
    setIsUpdate,
  } = useContext(CustomerContext) as CustomerContextType;

  const [apContactAddress, setAPContactAddress] = useState(default_contact);
  const [shippingAddress, setShippingAddress] = useState(default_contact);

  const updateCustomerMutation = useQueryMutation({
    mutator: updateContact,
    method: 'PUT',
    query: 'customers',
  });

  const addCustomerMutation = useQueryMutation({
    mutator: addContact,
    method: 'POST',
    query: 'customers',
    errorClosure: (error: AxiosResponse<any, any>) => {
      if (error?.status === 200) {
        setTabState(false);
        if (!isUpdate) setValue(null, 4);
      }
    },
  });

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      shipping_contact: {
        ...shippingAddress,
        id: context_customer?.shipping_contact,
      },
      ap_contact: {
        ...apContactAddress,
        id: context_customer?.ap_contact,
      },
      customer_id: context_customer?.id,
      user_id: user?.id,
    };

    console.log(body);

    if (isUpdate) {
      updateCustomerMutation.mutate(body);
    } else {
      addCustomerMutation.mutate(body);
    }

    setContextCustomer((prev) => {
      return {
        ...prev,
        shipping_contact_data: body.shipping_contact,
        ap_contact_data: body.ap_contact,
      };
    });
  };

  const ClearForm = () => {
    setAPContactAddress(default_contact);
    setShippingAddress(default_contact);
  };

  useEffect(() => {
    if (context_customer.shipping_contact || context_customer.ap_contact) {
      setIsUpdate(true);
      if (context_customer.shipping_contact_data) {
        setShippingAddress({ ...context_customer.shipping_contact_data });
      }

      if (context_customer.ap_contact_data) {
        setAPContactAddress({ ...context_customer.ap_contact_data });
      }
    } else {
      setIsUpdate(false);
    }
  }, [customer_id, context_customer]);
  return (
    <Grid
      component="form"
      onSubmit={submitForm}
      className="p-3 w-100"
      container
      direction="row"
      justifyContent="space-center"
      alignItems="center"
      columnSpacing={2}
      rowSpacing={1}
      columns={16}
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
            title="Shipping Contact"
            firstDivider={false}
          />
          <ContactForm
            state={shippingAddress}
            setter={setShippingAddress}
            contactType="ShippingContact"
            phone
            ext
            fax
            cell
            email
          />
        </Grid>
        <Grid item>
          <TitleFragment size="h3" title="A/P Contact" firstDivider={false} />
          <ContactForm
            state={apContactAddress}
            setter={setAPContactAddress}
            contactType="APContact"
            phone
            ext
            fax
            cell
            email
          />
        </Grid>
      </Grid>
      <FormButtons isUpdate={isUpdate} reducer={reducer} clear={ClearForm} />
    </Grid>
  );
};

export default CustomerContact;
