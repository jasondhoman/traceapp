import axios, { AxiosError } from 'axios';
import { ICreditMemoFormData, IResponse } from '../../../@types/tracetypes';

import { GridRowId } from '@mui/x-data-grid-pro';
import { config } from '../../../utils/config';
import { GetAuthTokens } from '../../../utils/helpers';

const tokens = GetAuthTokens();

const creditMemoAPI = axios.create({
  baseURL: config.VITE_API_ROOT + '/creditmemo',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getCreditMemos = async () => {
  try {
    const response = await creditMemoAPI.get('/all');
    return response.data;
  } catch (err) {
    console.error(err);
    const error = err as AxiosError;
    return error;
  }
};

export const getCreditMemo = async (
  id: number
): Promise<IResponse<ICreditMemoFormData>> => {
  try {
    const response = await creditMemoAPI.get(`/${id}`);
    return { status: response.status, data: response.data, message: null };
  } catch (err) {
    console.error(err);
    const error = err as AxiosError;
    console.error(error);
    return { status: error.status, data: null, message: null };
  }
};

export const updateCreditMemo = async (body: any) => {
  const response = await creditMemoAPI.put('', {
    ...body,
  });
  return response;
};

export const createCreditMemo = async (body: any) => {
  const response = await creditMemoAPI.post('', {
    ...body,
  });

  return response;
};

export const deleteCreditMemos = async (ids: Set<GridRowId>) => {
  try {
    const response = await creditMemoAPI.delete('/', {
      data: {
        memo_ids: [...ids],
      },
    });

    return response;
  } catch (error: any) {
    const err = error as AxiosError;
    return err.response;
  }
};
