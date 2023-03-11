import axios, { AxiosError } from 'axios';
import { IRawMaterialFormData, IResponse } from '../../../@types/tracetypes';

import { GridRowId } from '@mui/x-data-grid-pro';
import { config } from '../../../utils/config';
import { GetAuthTokens } from '../../../utils/Helpers';

const tokens = GetAuthTokens();

const rawMaterialAPI = axios.create({
  baseURL: config.VITE_API_ROOT + '/rawmaterial',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getRawMaterials = async () => {
  try {
    const response = await rawMaterialAPI.get('/rawmaterials');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getRawMaterialsWithStock = async () => {
  try {
    const response = await rawMaterialAPI.get('/rawmaterialswithstock');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getRawMaterial = async (
  id: number
): Promise<IResponse<IRawMaterialFormData>> => {
  const res: IResponse<IRawMaterialFormData> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await rawMaterialAPI.get(`/${id}`);
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

export const updateRawMaterial = async (body: any) => {
  const response = await rawMaterialAPI.put('/', {
    ...body,
  });
  return response;
};

export const addRawMaterial = async (body: any) => {
  const response = await rawMaterialAPI.post('/', {
    ...body,
  });

  return response;
};

export const deleteRawMaterials = async (ids: Set<GridRowId>) => {
  try {
    const response = await rawMaterialAPI.delete('/', {
      data: {
        raw_mats_ids: [...ids],
      },
    });
    return response;
  } catch (error: any) {
    const err = error as AxiosError;
    return err.response;
  }
};
