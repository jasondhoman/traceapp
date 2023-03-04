import axios, { AxiosError } from 'axios';
import { ICustomerSize, IResponse } from '../../../@types/tracetypes';
import { GetAuthTokens, urlEncoded } from '../../../utils/Helpers';

import { GridRowId } from '@mui/x-data-grid-pro';

const tokens = GetAuthTokens();

const customersizeAPI = axios.create({
  baseURL:
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import.meta.env.NODE_ENV === 'development'
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        import.meta.env.VITE_API_DEV_ROOT + '/customersize'
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        import.meta.env.VITE_API_ROOT + '/customersize',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getCustomerSizes = async () => {
  const response = await customersizeAPI.get('/customersizes');
  return response.data;
};

export const getCustomerSize = async (
  id: number
): Promise<IResponse<ICustomerSize>> => {
  const res: IResponse<ICustomerSize> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await customersizeAPI.get(`/${id}`);
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

export const getCustomerTags = async (id: number, grade: string) => {
  try {
    const response = await customersizeAPI.get(
      `/customersizesbyid/tags/${id}/${urlEncoded(grade)}`
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getCustomerSizeByCustomer = async (id: number) => {
  if (id !== null && id !== undefined) {
    const response = await customersizeAPI.get(
      `/customersizesbyid/grades/${id}`
    );
    return response.data;
  }
};

export const getCustomerSizeLookupByCustomer = async (id: number) => {
  if (id !== null && id !== undefined) {
    const response = await customersizeAPI.get(`/customersizesbyid/${id}`);
    return response.data;
  }
};

export const updateCustomerSize = async (body: any) => {
  const authTokens = GetAuthTokens();

  const response = await customersizeAPI.put('/', {
    refresh: authTokens?.refresh,

    ...body,
  });
  return response;
};

export const addCustomerSize = async (body: any) => {
  const authTokens = GetAuthTokens();

  const response = await customersizeAPI.post('/', {
    refresh: authTokens?.refresh,
    ...body,
  });

  return response;
};

export const deleteCustomersizes = async (ids: Set<GridRowId>) => {
  const authTokens = GetAuthTokens();

  try {
    const response = await customersizeAPI.delete('/customersizes', {
      data: {
        refresh: authTokens?.refresh,

        cust_size_ids: [...ids],
      },
    });
    return response;
  } catch (error: any) {
    const err = error as AxiosError;
    return err.response;
  }
};
