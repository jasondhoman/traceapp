import axios, { AxiosError } from 'axios';
import {
  IOrderFormData,
  IProductionFormData,
  IResponse,
} from '../../../@types/tracetypes';

import { GridRowId } from '@mui/x-data-grid-pro';
import { config } from '../../../utils/config';
import { GetAuthTokens, urlEncoded } from '../../../utils/Helpers';

const tokens = GetAuthTokens();

const orderAPI = axios.create({
  baseURL: config.VITE_API_ROOT + '/order',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getOrders = async () => {
  const response = await orderAPI.get('/orders');
  return response.data;
};

export const getOrder = async (
  id: number
): Promise<IResponse<IOrderFormData>> => {
  const res: IResponse<IOrderFormData> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await orderAPI.get(`${id}`);
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

export const updateOrder = async (body: any) => {
  const response = await orderAPI.put('/', {
    ...body,
  });
  return response;
};

export const addOrder = async (body: any) => {
  const response = await orderAPI.post('/', {
    ...body,
  });

  return response;
};

export const getProductionInformation = async (
  id: any
): Promise<IResponse<IProductionFormData>> => {
  const res: IResponse<IProductionFormData> = {
    status: 0,
    message: null,
    data: null,
  };

  if (id !== null && id !== undefined) {
    try {
      const response = await orderAPI.get(
        `/productioninformation/${id.toString()}`
      );
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

export const updateProductionInfo = async (body: any) => {
  const response = await orderAPI.put('/productioninformation', {
    ...body,
  });
  return response;
};

export const getOrderTrackingIdsForWeight = async () => {
  const response = await orderAPI.get('/trackingids');
  return response.data;
};

export const getOrderTrackingIds = async () => {
  const response = await orderAPI.get('/ordertrackingids');
  return response.data;
};

interface WeightToShipRes {
  tracking: number;
  grade?: string;
  ship_date?: string;
  company_name?: string;
  tag_size?: string;
  total_weight: number;
  qty: number;
  min_weight: number;
  max_weight: number;
  weights: number[];
}

export const getOrderInfoByTracking = async (
  tracking: string
): Promise<WeightToShipRes | null> => {
  try {
    if (tracking !== null && tracking !== undefined) {
      const response = await orderAPI.get(`/weightstoship/${tracking}`);
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const deleteOrders = async (ids: Set<GridRowId>) => {
  const response = await orderAPI.delete('/orders', {
    data: {
      order_ids: [...ids],
    },
  });

  return response;
};

// archive orders
export const archiveOrders = async (ids: Set<GridRowId>) => {
  try {
    const response = await orderAPI.put('/archive', {
      order_ids: [...ids],
    });
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// archive orders
export const bulkArchiveOrdersByDate = async (enddate: string) => {
  try {
    const response = await orderAPI.get(`/bulkarchive/${urlEncoded(enddate)}`);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// Get Next Tracking Number
export const getNextTrackingNumber = async () => {
  try {
    const response = await orderAPI.get('/trackingnumber');
    return response.data;
  } catch (error: any) {
    const err = error as AxiosError;
    return err.response;
  }
};

// Get ID from Tracking Number
export const getIdFromTrackingNumber = async (tracking: number) => {
  try {
    const response = await orderAPI.get(`/orderid/${tracking}`);
    return response.data;
  } catch (error: any) {
    const err = error as AxiosError;
    return err.response;
  }
};

// export orders to csv
export const getOrdersExport = async () => {
  try {
    const response = await orderAPI.get(`/export`);
    const file = new Blob([response.data.csv], { type: 'text/csv' });
    const today = new Date();
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //download the file
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', `orders_${today.getTime()}.csv`);
    link.click();
  } catch (err) {
    console.log(err);
    return err;
  }
};

// export orders to csv
export const getOrdersArchivedExport = async (
  beginDate: string,
  endDate: string
) => {
  try {
    const response = await orderAPI.get(
      `/archivedexport/${beginDate}/${endDate}`
    );
    const file = new Blob([response.data.csv], { type: 'text/csv' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //download the file
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', `orders_${beginDate}_${endDate}.csv`);
    link.click();
  } catch (err) {
    console.error(err);
    return err;
  }
};

//delete order by tracking
export const deleteOrderByTracking = async (beg: number, end: number) => {
  try {
    const response = await orderAPI.delete(`/${beg}/${end}`);
    return response;
  } catch (err) {
    const error = err as AxiosError;
    return error;
  }
};
