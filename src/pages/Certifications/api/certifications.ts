import axios, { AxiosError, AxiosResponse } from 'axios';
import DeleteResponse, {
  ICertification,
  IResponse,
  MessageResponse,
} from '../../../@types/tracetypes';

import { GridRowId } from '@mui/x-data-grid-pro';
import { config } from '../../../utils/config';
import { GetAuthTokens } from '../../../utils/Helpers';

const tokens = GetAuthTokens();

const certificationAPI = axios.create({
  baseURL: config.VITE_API_ROOT + '/certification/',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getCertificates = async (): Promise<ICertification[] | []> => {
  try {
    const response = await certificationAPI.get('certifications');
    return response.data;
  } catch (err) {
    return [];
  }
};

export const getCertificate = async (
  id: number
): Promise<IResponse<ICertification>> => {
  const res: IResponse<ICertification> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await certificationAPI.get(`${id}`);
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

export const updateCertificate = async (
  body: any
): Promise<AxiosResponse<MessageResponse>> => {
  const response = await certificationAPI.put('', {
    ...body,
  });
  return response;
};

export const addCertificate = async (
  body: any
): Promise<AxiosResponse<MessageResponse>> => {
  const response = await certificationAPI.post('', {
    ...body,
  });

  return response;
};

export const deleteCertificates = async (
  ids: Set<GridRowId>
): Promise<AxiosResponse<DeleteResponse>> => {
  try {
    const response = await certificationAPI.delete('certifications', {
      data: {
        certificate_ids: [...ids],
      },
    });
    return response;
  } catch (error: any) {
    const err = error as AxiosError;
    return err.response as AxiosResponse<DeleteResponse>;
  }
};
