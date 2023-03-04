import React, { useContext, useEffect, useState } from 'react';
import { ReducerActionType, SetPageState } from '../../../utils/reducers';
import { addAdditionalContact, updateAdditionalContact } from '../api/customer';

import Grid from '@mui/material/Grid';
import { AxiosResponse } from 'axios';
import { AuthContextType } from '../../../@types/authcontext';
import { CustomerContextType } from '../../../@types/customercontext';
import { StateContextType } from '../../../@types/statecontext';
import { ICustomerFormData } from '../../../@types/tracetypes';
import ContactForm from '../../../components/form/ContactForm';
import FormButtons from '../../../components/ui/FormButtons';
import TitleFragment from '../../../components/ui/TitleFragment';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
import { default_contact } from '../../../utils/Constants';
import { CustomerContext } from '../context/Customer.Context';

interface ICustomerNew {
  reducer: React.Dispatch<SetPageState>;
  prop_customer?: ICustomerFormData | null;
}

const CustomerNew: React.FC<ICustomerNew> = ({ reducer, prop_customer }) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { setLoading } = useContext(StateContext) as StateContextType;
  const {
    customer_id,
    isUpdate,
    context_customer,
    setIsUpdate,
    setContextCustomer,
  } = useContext(CustomerContext) as CustomerContextType;

  //Additional Contact
  const [purchasingAgent, setPurchasingAgent] = useState(default_contact);

  const [additionalContactOne, setAdditionalContactOne] =
    useState(default_contact);
  const [additionalContactTwo, setAdditionalContactTwo] =
    useState(default_contact);
  const [additionalContactThree, setAdditionalContactThree] =
    useState(default_contact);

  const updateCustomerMutation = useQueryMutation({
    mutator: updateAdditionalContact,
    method: 'PUT',
    query: 'customers',
  });

  const addCustomerMutation = useQueryMutation({
    mutator: addAdditionalContact,
    method: 'POST',
    query: 'customers',
    errorClosure: (error: AxiosResponse<any, any>) => {
      if (error?.status === 200) {
        if (!isUpdate) {
          reducer({
            type: ReducerActionType.SET_ID,
            payload: {
              id: null,
            },
          });
        }
      }
    },
  });

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      purchasing_agent: {
        ...purchasingAgent,
        id: isUpdate ? context_customer?.purchasing_agent : null,
      },
      additional_contact1: {
        ...additionalContactOne,
        id: isUpdate ? context_customer?.additional_contact1 : null,
      },
      additional_contact2: {
        ...additionalContactTwo,
        id: isUpdate ? context_customer?.additional_contact2 : null,
      },
      additional_contact3: {
        ...additionalContactThree,
        id: isUpdate ? context_customer?.additional_contact3 : null,
      },
      customer_id: context_customer?.id,
      user_id: user?.id,
    };

    if (isUpdate) {
      updateCustomerMutation.mutate(body);
    } else {
      addCustomerMutation.mutate(body);
    }
    setContextCustomer((prev) => {
      return {
        ...prev,
        purchasing_agent_data: {
          ...body.purchasing_agent,
          id: context_customer?.purchasing_agent ?? null,
        },
        additional_contact1_data: {
          ...body.additional_contact1,
          id: context_customer?.additional_contact1 ?? null,
        },
        additional_contact2_data: {
          ...body.additional_contact2,
          id: context_customer?.additional_contact2 ?? null,
        },
        additional_contact3_data: {
          ...body.additional_contact3,
          id: context_customer?.additional_contact3 ?? null,
        },
      };
    });
  };

  const ClearForm = () => {
    setPurchasingAgent(default_contact);
    setAdditionalContactOne(default_contact);
    setAdditionalContactTwo(default_contact);
    setAdditionalContactThree(default_contact);
  };

  useEffect(() => {
    if (
      context_customer.purchasing_agent &&
      context_customer.additional_contact1 &&
      context_customer.additional_contact2 &&
      context_customer.additional_contact3
    ) {
      setIsUpdate(true);
      if (context_customer.purchasing_agent_data) {
        setPurchasingAgent({ ...context_customer.purchasing_agent_data });
      }
      if (context_customer.additional_contact1_data) {
        setAdditionalContactOne({
          ...context_customer.additional_contact1_data,
        });
      }
      if (context_customer.additional_contact2_data) {
        setAdditionalContactTwo({
          ...context_customer.additional_contact2_data,
        });
      }
      if (context_customer.additional_contact3_data) {
        setAdditionalContactThree({
          ...context_customer.additional_contact3_data,
        });
      }
    } else {
      setIsUpdate(false);
    }
  }, [customer_id]);
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-center"
      alignItems="center"
      columnSpacing={2}
      rowSpacing={1}
      columns={16}
      component="form"
      onSubmit={submitForm}
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
            title="Purchasing Agent"
            firstDivider={false}
          />
          <ContactForm
            state={purchasingAgent}
            setter={setPurchasingAgent}
            contactType="PurchasingAgent"
            phone
            ext
            fax
            cell
            email
          />
        </Grid>
        <Grid item>
          <TitleFragment
            size="h3"
            title="Additional Contact"
            firstDivider={false}
          />
          <ContactForm
            state={additionalContactOne}
            setter={setAdditionalContactOne}
            contactType="AdditionalContactOne"
            phone
            ext
            fax
            cell
            email
          />
        </Grid>
      </Grid>
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
            title="Additional Contact"
            firstDivider={false}
          />
          <ContactForm
            state={additionalContactTwo}
            setter={setAdditionalContactTwo}
            contactType="AdditionalContactTwo"
            phone
            ext
            fax
            cell
            email
          />
        </Grid>
        <Grid item>
          <TitleFragment
            size="h3"
            title="Additional Contact"
            firstDivider={false}
          />
          <ContactForm
            state={additionalContactThree}
            setter={setAdditionalContactThree}
            contactType="AdditionalContactThree"
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

export default CustomerNew;
