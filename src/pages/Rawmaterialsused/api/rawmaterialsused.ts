import axios, { AxiosError } from 'axios';
import {
  IRawMaterialsUsedFormData,
  IResponse,
} from '../../../@types/tracetypes';

import { GridRowId } from '@mui/x-data-grid-pro';
import { config } from '../../../utils/config';
import { GetAuthTokens } from '../../../utils/Helpers';

const tokens = GetAuthTokens();

const rawMaterialUsedAPI = axios.create({
  baseURL: config.VITE_API_ROOT + '/rawmaterialused',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getRawMaterialsUsed = async () => {
  const response = await rawMaterialUsedAPI.get('/rawmaterialsused');
  return response.data;
};

export const getRawMaterialUsed = async (
  id: number
): Promise<IResponse<IRawMaterialsUsedFormData>> => {
  const res: IResponse<IRawMaterialsUsedFormData> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await rawMaterialUsedAPI.get(`/${id}`);
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

export const updateRawMaterialUsed = async (body: any) => {
  const response = await rawMaterialUsedAPI.put('/', {
    ...body,
  });
  return response;
};

export const addRawMaterialused = async (body: any) => {
  const response = await rawMaterialUsedAPI.post('/', {
    ...body,
  });

  return response;
};

export const deleteRawMatsUsed = async (ids: Set<GridRowId>) => {
  try {
    const response = await rawMaterialUsedAPI.delete('/', {
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

// export orders to csv
export const getRawMatUsedExport = async () => {
  try {
    const response = await rawMaterialUsedAPI.get(`/export`);
    const file = new Blob([response.data.csv], { type: 'text/csv' });
    //get todays date as a string in us format
    const today = new Date();
    const beginDate = formatShortDate(today);

    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //download the file
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', `raw_materials_used_${beginDate}.csv`);
    link.click();
  } catch (err) {
    console.error(err);
    return err;
  }
};
