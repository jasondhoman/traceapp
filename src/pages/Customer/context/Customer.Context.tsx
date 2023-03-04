import React, { createContext, useState } from 'react';

import { CustomerContextType } from '../../../@types/customercontext';
import { ICustomerFormData } from '../../../@types/tracetypes';
import { default_customer } from '../../../utils/Constants';

export const CustomerContext = createContext<CustomerContextType | null>(null);

const CustomerProvider: React.FC<React.ReactPortal> = ({ children }) => {
  const [customer_id, setCustomerID] = useState(0);
  const [isUpdate, setIsUpdate] = useState(customer_id > 0 ? true : false);
  const [context_customer, setContextCustomer] =
    useState<ICustomerFormData>(default_customer);

  const context_data = {
    customer_id: customer_id,
    setCustomerID: setCustomerID,
    isUpdate: isUpdate,
    setIsUpdate: setIsUpdate,
    context_customer: context_customer,
    setContextCustomer: setContextCustomer,
  };
  return (
    <CustomerContext.Provider value={context_data}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;
