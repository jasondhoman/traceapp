import axios, { AxiosError } from 'axios';
import { config } from '../../../utils/config';
import { GetAuthTokens } from '../../../utils/Helpers';

const tokens = GetAuthTokens();

export const reportingAPI = axios.create({
  baseURL: config.VITE_API_ROOT + '/reporting',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getCustomerList = async () => {
  try {
    const response = await reportingAPI.get('/customers');
    return response.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getSalespersonList = async () => {
  try {
    const response = await reportingAPI.get('/salespersons');
    return response.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getCertificationsList = async () => {
  try {
    const response = await reportingAPI.get('/certifications');
    return response.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getRawMaterialList = async () => {
  try {
    // response type blob is important for pdfs to render properly
    const response = await reportingAPI.get('/rawmaterials', {
      responseType: 'blob',
    });
    const file = new Blob([response.data], { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL, '_blank');
    // return ;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getGradeMixList = async () => {
  try {
    // response type blob is important for pdfs to render properly
    const response = await reportingAPI.get('/grademixes', {
      responseType: 'blob',
    });
    const file = new Blob([response.data], { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL, '_blank');
    // return ;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getInvoiceReport = async (id: number) => {
  try {
    const response = await reportingAPI.get(`/invoice/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getWeightReport = async (id: number) => {
  // response type blob is important for pdfs to render properly
  const response = await reportingAPI.get(`/weights/${id}`, {
    responseType: 'blob',
  });

  const file = new Blob([response.data], { type: 'application/pdf' });
  //Build a URL from the file
  const fileURL = URL.createObjectURL(file);
  //Open the URL on new Window
  window.open(fileURL, '_blank');
  // return ;
};

export const getProductionInformation = async (id: number) => {
  try {
    // response type blob is important for pdfs to render properly
    const response = await reportingAPI.get(`/productionrun/${id}`, {
      responseType: 'blob',
    });
    const file = new Blob([response.data], { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL, '_blank');
    // return ;
    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getSalesOrderDocument = async (
  beginningTrackingNumber: number,
  endTrackingNumber: number
) => {
  try {
    // response type blob is important for pdfs to render properly
    const response = await reportingAPI.get(
      `/salesorder/${beginningTrackingNumber}/${endTrackingNumber}`,
      {
        responseType: 'blob',
      }
    );
    const file = new Blob([response.data], { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL, '_blank');
    // return ;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getFinishedInventoryReport = async () => {
  try {
    // response type blob is important for pdfs to render properly
    const response = await reportingAPI.get(`/finishedinventory`, {
      responseType: 'blob',
    });
    if (response.status !== 200 || !response.data || response.data.size === 0) {
      return { message: 'No Finished Inventory Data was found Found' };
    }
    const file = new Blob([response.data], { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL, '_blank');
    // return ;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getLinterReport = async () => {
  try {
    // response type blob is important for pdfs to render properly
    const response = await reportingAPI.get(`/linter`, {
      responseType: 'blob',
    });
    const file = new Blob([response.data], { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window

    window.open(fileURL, '_blank');

    return response;
    // return ;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const postLinterReport = async () => {
  try {
    // response type blob is important for pdfs to render properly
    const response = await reportingAPI.post(`/linter`);
    return response;
    // return ;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getSalesCommissionReport = async (
  beginDate: string,
  endDate: string
) => {
  try {
    // response type blob is important for pdfs to render properly
    const response = await reportingAPI.get(
      `/salescommission/${beginDate}/${endDate}`,
      {
        responseType: 'blob',
      }
    );
    const file = new Blob([response.data], { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL, '_blank');
    // return ;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const generateBOL = async (
  beginningTrackingNumber: number,
  endTrackingNumber: number
) => {
  try {
    // response type blob is important for pdfs to render properly
    const response = await reportingAPI.get(
      `/bol/${beginningTrackingNumber}/${endTrackingNumber}`,
      {
        responseType: 'blob',
      }
    );
    const file = new Blob([response.data], { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL, '_blank');
    // return ;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const generateInvoice = async (id: number) => {
  try {
    // response type blob is important for pdfs to render properly
    const response = await reportingAPI.get(`/invoice/${id}`, {
      responseType: 'blob',
    });
    const file = new Blob([response.data], { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL, '_blank');
    // return ;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const generateCreditMemo = async (id: number) => {
  try {
    // response type blob is important for pdfs to render properly
    const response = await reportingAPI.get(`/creditmemo/${id}`, {
      responseType: 'blob',
    });
    const file = new Blob([response.data], { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL, '_blank');
    // return ;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const runETL = async () => {
  try {
    const response = await reportingAPI.get(`/runetl`);
    return response;
  } catch (err) {
    const error = err as AxiosError;
    return error;
  }
};
