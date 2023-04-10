import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { CustomerContextType } from '../../../@types/customercontext';
import { ICustomerFormData } from '../../../@types/tracetypes';
import { default_customer } from '../../../utils/constants';
import { getCustomer } from '../api/customer';

export const CustomerContext = createContext<CustomerContextType | null>(null);

const CustomerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [customer_id, setCustomerID] = useState(0);
  const [isUpdate, setIsUpdate] = useState(customer_id > 0 ? true : false);
  const [context_customer, setContextCustomer] =
    useState<ICustomerFormData>(default_customer);

  const resetCustomerContext = () => {
    setCustomerID(0);
    setIsUpdate(false);
    setContextCustomer(default_customer);
  };

  const getContextCustomer = useCallback(async (id: number) => {
    const customer = await getCustomer(id);
    if (customer) {
      const customerData = {
        ...default_customer,
        ...customer.data,
      };

      setContextCustomer(customerData);
    }
  }, []);

  useEffect(() => {
    if (customer_id > 0) {
      getContextCustomer(customer_id);
    }
  }, [customer_id, getContextCustomer]);

  const context_data = {
    customer_id,
    setCustomerID,
    isUpdate,
    setIsUpdate,
    context_customer,
    setContextCustomer,
    resetCustomerContext,
  };
  return (
    <CustomerContext.Provider value={context_data}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;

// throw error if not use in provider
export const useCustomerContext = () => {
  const context = useContext(CustomerContext) as CustomerContextType;
  if (context === undefined) {
    throw new Error(
      'useCustomerContext must be used within a CustomerProvider'
    );
  }
  return context;
};
