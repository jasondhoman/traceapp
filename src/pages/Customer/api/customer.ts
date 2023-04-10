import axios, { AxiosError, AxiosResponse } from 'axios';
import DeleteResponse, {
  CustomerRow,
  ICustomerFormData,
  IResponse,
  IShippingContact,
  MessageResponse,
} from '../../../@types/tracetypes';

import { GridRowId } from '@mui/x-data-grid-pro';
import { config } from '../../../utils/config';
import { GetAuthTokens } from '../../../utils/helpers';

const tokens = GetAuthTokens();

const customerAPI = axios.create({
  baseURL: config.VITE_API_ROOT + '/customer',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const CUSTOMER_URL = {
  ADDITIONAL_CONTACT: 'customeradditionalcontact',
  CUSTOMER_BILLING: 'customerbilling',
  CUSTOMER_CONTACT: 'customercontact',
};

export const getCustomers = async (): Promise<CustomerRow[]> => {
  const response = await customerAPI.get('/customers');
  return response.data;
};

export const getCustomer = async (
  id: number
): Promise<IResponse<ICustomerFormData>> => {
  const res: IResponse<ICustomerFormData> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await customerAPI.get(`/${id}`);

      res.status = response.status;
      res.data = response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.status) {
        res.status = parseInt(error.status);
      }
      if (error.response) {
        interface IMessage {
          message: string;
        }
        const d = error.response.data as IMessage;
        if (d.message) {
          res.message = d.message;
        }
      }
    }
  }
  return res;
};

export const getCustomerShipping = async (
  id: number
): Promise<IResponse<IShippingContact>> => {
  const res: IResponse<IShippingContact> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await customerAPI.get(`customershipping/${id}`);
      res.status = response.status;
      res.data = response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.status) {
        res.status = parseInt(error.status);
      }
      if (error.response) {
        interface IMessage {
          message: string;
        }
        const d = error.response.data as IMessage;
        if (d.message) {
          res.message = d.message;
        }
      }
    }
  }
  return res;
};

export const updateContact = async (
  body: any
): Promise<AxiosResponse<MessageResponse>> => {
  return await customerAPI.put('/customercontact', {
    ...body,
  });
};

export const addContact = async (
  body: any
): Promise<AxiosResponse<MessageResponse>> => {
  return await customerAPI.post('/customercontact', {
    ...body,
  });
};

export const addAdditionalContact = async (
  body: any
): Promise<AxiosResponse<MessageResponse>> => {
  return await customerAPI.post('/customeradditionalcontact', {
    ...body,
  });
};

export const updateAdditionalContact = async (
  body: any
): Promise<AxiosResponse<MessageResponse>> => {
  return await customerAPI.put('/customeradditionalcontact', {
    ...body,
  });
};

export const addShippingBilling = async (
  body: any
): Promise<AxiosResponse<MessageResponse>> => {
  const response = await customerAPI.post(`/customerbilling`, {
    ...body,
  });
  return response;
};

export const updateShippingBilling = async (
  body: any
): Promise<AxiosResponse<MessageResponse>> => {
  const response = await customerAPI.put(`/customerbilling`, {
    ...body,
  });
  return response;
};

export const addCustomer = async (
  body: any
): Promise<AxiosResponse<MessageResponse>> => {
  const response = await customerAPI.post('/', {
    ...body,
  });
  return response;
};

export const updateCustomer = async (
  body: any
): Promise<AxiosResponse<MessageResponse>> => {
  return await customerAPI.put('/', {
    ...body,
  });
};

export const deleteCustomers = async (
  ids: Set<GridRowId>
): Promise<AxiosResponse<DeleteResponse>> => {
  try {
    const response = await customerAPI.delete('/', {
      data: {
        customer_ids: [...ids],
      },
    });

    return response;
  } catch (error: any) {
    const err = error as AxiosError;
    return err.response as AxiosResponse<DeleteResponse>;
  }
};
