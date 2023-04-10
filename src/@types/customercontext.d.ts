import { Dispatch, SetStateAction } from 'react';
import { ICustomerFormData } from './tracetypes';

export type CustomerContextType = {
  context_customer: ICustomerFormData;
  setContextCustomer: Dispatch<SetStateAction<ICustomerFormData>>;
  customer_id: number;
  setCustomerID: Dispatch<SetStateAction<number>>;
  isUpdate: boolean;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  resetCustomerContext: () => void;
};
