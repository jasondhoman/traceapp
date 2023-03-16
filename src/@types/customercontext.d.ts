import { ICustomerFormData } from './tracetypes';

export type CustomerContextType = {
  context_customer: ICustomerFormData;
  setContextCustomer: React.Dispatch<React.SetStateAction<ICustomerFormData>>;
  customer_id: number;
  setCustomerID: React.Dispatch<React.SetStateAction<number>>;
  isUpdate: boolean;
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  resetCustomerContext: () => void;
};
