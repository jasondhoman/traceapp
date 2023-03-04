import axios, { AxiosError } from 'axios';
import { IResponse, ISalesPersonFormData } from '../../../@types/tracetypes';

import { GridRowId } from '@mui/x-data-grid-pro';
import { GetAuthTokens } from '../../../utils/Helpers';

const tokens = GetAuthTokens();

const salespersonAPI = axios.create({
  baseURL:
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import.meta.env.NODE_ENV === 'development'
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        import.meta.env.VITE_API_DEV_ROOT + '/salesperson'
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        import.meta.env.VITE_API_ROOT + '/salesperson',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getSalespersons = async () => {
  const response = await salespersonAPI.get('/salespersons');
  return response.data;
};
export const getSalesperson = async (
  id: number
): Promise<IResponse<ISalesPersonFormData>> => {
  const res: IResponse<ISalesPersonFormData> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await salespersonAPI.get(`/${id}`);
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

export const updateSalesperson = async (body: any) => {
  const response = await salespersonAPI.put('/', {
    ...body,
  });
  return response;
};

export const addSalesperson = async (body: any) => {
  const response = await salespersonAPI.post('/', {
    ...body,
  });

  return response;
};

//deletesalepersons
export const deleteSalepersons = async (ids: Set<GridRowId>) => {
  try {
    const response = await salespersonAPI.delete('/', {
      data: {
        sales_ids: [...ids],
      },
    });
    return response;
  } catch (error: any) {
    const err = error as AxiosError;
    return err.response;
  }
};
