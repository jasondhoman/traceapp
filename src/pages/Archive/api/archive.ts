import axios, { AxiosError } from 'axios';
import { ArchivedOrderFormData, IResponse } from '../../../@types/tracetypes';

import { config } from '../../../utils/config';
import { GetAuthTokens } from '../../../utils/helpers';

const tokens = GetAuthTokens();

const archiveAPI = axios.create({
  baseURL: config.VITE_API_ROOT + '/archive',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getArchivedOrders = async () => {
  try {
    const response = await archiveAPI.get('/all');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getArchivedOrder = async (
  id: number
): Promise<IResponse<ArchivedOrderFormData>> => {
  const res: IResponse<ArchivedOrderFormData> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await archiveAPI.get<ArchivedOrderFormData>(`${id}`);
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
