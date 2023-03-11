import axios, { AxiosError } from 'axios';
import { IGradeMix, IResponse } from '../../../@types/tracetypes';

import { GridRowId } from '@mui/x-data-grid-pro';
import { config } from '../../../utils/config';
import { GetAuthTokens } from '../../../utils/Helpers';

const tokens = GetAuthTokens();

const gradeMixAPI = axios.create({
  baseURL: config.VITE_API_ROOT + '/grademix',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getGradeMixes = async () => {
  const response = await gradeMixAPI.get('/grademixes');
  return response.data;
};

export const getGradeMix = async (
  id: number
): Promise<IResponse<IGradeMix>> => {
  const res: IResponse<IGradeMix> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await gradeMixAPI.get(`/${id}`);
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

export const updateGradeMix = async (body: any) => {
  const response = await gradeMixAPI.put('/', {
    ...body,
  });
  return response;
};

export const addGradeMix = async (body: any) => {
  const response = await gradeMixAPI.post('/', {
    ...body,
  });

  return response;
};

//delete Grade Mix
export const deleteGradeMixes = async (ids: Set<GridRowId>) => {
  try {
    const response = await gradeMixAPI.delete('/grademixes', {
      data: {
        grade_mix_ids: [...ids],
      },
    });

    return response;
  } catch (error: any) {
    const err = error as AxiosError;
    return err.response;
  }
};
