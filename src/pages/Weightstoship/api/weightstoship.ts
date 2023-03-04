import axios, { AxiosError } from 'axios';
import { IResponse, IWeightsToShipOut } from '../../../@types/tracetypes';

import { GridRowId } from '@mui/x-data-grid-pro';
import { GetAuthTokens } from '../../../utils/Helpers';

const tokens = GetAuthTokens();

const weightsAPI = axios.create({
  baseURL:
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import.meta.env.NODE_ENV === 'development'
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        import.meta.env.VITE_API_DEV_ROOT + '/weights'
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        import.meta.env.VITE_API_ROOT + '/weights',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getWeights = async () => {
  const response = await weightsAPI.get('/weights');
  return response.data;
};

export const getWeight = async (
  id: number
): Promise<IResponse<IWeightsToShipOut>> => {
  const res: IResponse<IWeightsToShipOut> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await weightsAPI.get(`/${id}`);
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

export const updateWeight = async (body: any) => {
  const response = await weightsAPI.put('/', {
    ...body,
  });
  return response;
};

export const addWeight = async (body: any) => {
  const response = await weightsAPI.post('/', {
    ...body,
  });

  return response;
};

//deletesalepersons
export const deleteWeights = async (ids: Set<GridRowId>) => {
  try {
    const response = await weightsAPI.delete('/', {
      data: {
        weight_ids: [...ids],
      },
    });
    return response;
  } catch (error: any) {
    const err = error as AxiosError;
    return err.response;
  }
};
