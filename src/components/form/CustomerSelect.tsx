//React
import React, { useEffect, useState } from 'react';

import AutocompleteFragment from './AutocompleteFragment';
//UI Components
import { CircularProgress } from '@mui/material';
//Types
import Grid from '@mui/material/Grid';
import { CustomerRow } from '../../@types/tracetypes';
//API / Helpers
import { getCustomers } from '../../pages/Customer/api/customer';
//Hooks
import { useQuery } from 'react-query';

interface ICustomerSelect {
  id: number;
  changeState: (id: number) => void;
  size?: number;
}

interface CustomerAutoCompleteProps {
  id: number;
  label: string | undefined;
}

const CustomerSelect: React.FC<ICustomerSelect> = ({
  id,
  changeState,
  size = 16,
}) => {
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerAutoCompleteProps>({
      id: 0,
      label: '',
    });
  const [customerAutoComplete, setCustomerAutoComplete] = useState<
    CustomerAutoCompleteProps[]
  >([]);

  const { isLoading, data: customers } = useQuery<CustomerRow[]>(
    'cust_select',
    getCustomers
  );

  useEffect(() => {
    if (customers) {
      const customerAutoComplete: CustomerAutoCompleteProps[] = customers.map(
        (customer) => {
          return {
            id: customer.id,
            label: customer.company_name,
          };
        }
      );
      customerAutoComplete.unshift({ id: 0, label: '' });
      const s = customerAutoComplete.find((c) => c.id === id);
      if (s) {
        setSelectedCustomer(s);
      }
      setCustomerAutoComplete(customerAutoComplete);
    }
  }, [customers, id]);

  return (
    <Grid item xs={size}>
      {!isLoading && customers ? (
        <AutocompleteFragment
          id="customer-select"
          label="Customer"
          state={selectedCustomer}
          viewingText={selectedCustomer.label}
          changeState={changeState}
          selectOptions={customerAutoComplete}
        />
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
};
export default CustomerSelect;
