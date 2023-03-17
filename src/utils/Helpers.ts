import { authTokens } from '../@types/authcontext';

interface User {
  id?: number;
}

interface AuthTokens {
  refresh?: string;
}
export async function GetCustomers(authTokens: AuthTokens, user: User) {
  const tokens = GetAuthTokens();
  const res = await fetch(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    `${import.meta.env.VITE_API_ROOT}/customer/customers`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: tokens?.refresh ?? '',
      },
      body: JSON.stringify({ refresh: authTokens?.refresh, id: user?.id }),
    }
  );
  const data = await res.json();
  if (data) {
    return data.customers;
  }
  return {};
}

export async function SendRequest(
  url: string,
  method: string,
  data: any,
  module_name: string,
  next: (state: boolean, message: string, color: string) => void
) {
  let message = 'Created';
  let error_message = 'Creating';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  url = `${import.meta.env.VITE_API_ROOT}/${url}`;

  if (method === 'PUT') {
    message = 'Updated';
    error_message = 'Updating';
  } else if (method === 'DELETE') {
    message = 'Deleted';
    error_message = 'Deleting';
  }
  const request = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (request.status === 200) {
    next(true, `Successfully ${message} ${module_name}`, 'success');
  } else {
    next(true, `Error ${error_message} ${module_name}`, 'error');
  }
  return request.status;
}

export async function SendRequestAndReturn(
  url: string,
  method: string,
  data: { [key: string]: any },
  module_name: string,
  next: (state: boolean, message: string, color: string) => void
) {
  let message = 'Created';
  let error_message = 'Creating';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  url = `${import.meta.env.VITE_API_ROOT}/${url}`;

  if (method === 'PUT') {
    message = 'Updated';
    error_message = 'Updating';
  } else if (method === 'DELETE') {
    message = 'Deleted';
    error_message = 'Deleting';
  }
  const request = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (module_name) {
    if (request.status === 200) {
      next(true, `Successfully ${message} ${module_name}`, 'success');
    } else {
      next(true, `Error ${error_message} ${module_name}`, 'error');
    }
  }
  return request;
}

export async function GetRequest<T>(
  url: string,
  body: { [key: string]: any },
  controller?: AbortController
) {
  const tokens = GetAuthTokens();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  url = `${import.meta.env.VITE_API_ROOT}${url}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: controller ? controller.signal : null,
      headers: {
        'Content-Type': 'application/json',
        Authorization: tokens?.refresh ?? '',
      },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      const data: T = await res.json();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (import.meta.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-restricted-syntax
        console.log(data);
      }
      return data;
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

export async function GetRequestV2<T>(
  url: string,
  body: { [Object: string]: any },
  controller?: AbortController
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  url = `${import.meta.env.VITE_API_ROOT}/${url}`;
  const tokens = GetAuthTokens();
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: controller ? controller.signal : null,
      headers: {
        'Content-Type': 'application/json',
        Authorization: tokens?.refresh ?? '',
      },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      const data: T = await res.json();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (import.meta.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-restricted-syntax
        console.log(data);
      }
      return data;
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

export function GetDate(d: Date): string {
  if (d === null || d === undefined) {
    return '';
  }
  return d.toISOString().split('T')[0];
}

export const formatWithCommas = (x: any) => {
  if (typeof x !== 'string') {
    x = x.toString();
  }
  if (x === null || x === undefined) {
    return '';
  }

  const [whole, decimal] = x.split('.');
  if (decimal) {
    return `${whole
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`;
  }
  return whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.00';
};

export function formatAsCurrency(v: string, d = 2): string {
  if (isNaN(Number(v))) {
    return '';
  }
  try {
    return `$${formatWithCommas(v)}`;
  } catch (error) {
    console.error(error);
  }
  return '';
}

export function formatShortDate(
  d: string | Date,
  options = {},
  separator = '-'
): string {
  const isDaysLessThanTen = (date: string) => {
    const day = date.split(separator)[1];
    return day.length === 1;
  };

  const isMonthLessThanTen = (date: string) => {
    const mth = date.split(separator)[0];
    return mth.length === 1;
  };
  if (d === '' || d === null || d === undefined) {
    return '';
  }
  if (typeof d === 'object') {
    d = d.toISOString();
  }
  const new_d = new Date(d.split('T')[0]);
  let usaDate = new_d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    ...options,
  });

  usaDate = usaDate.split('/').join(separator);

  if (isDaysLessThanTen(usaDate)) {
    const [mth, day, yr] = usaDate.split(separator);
    usaDate = `${mth}${separator}0${day}${separator}${yr}`;
  }
  if (isMonthLessThanTen(usaDate)) {
    usaDate = `0${usaDate}`;
  }

  return usaDate;
}

export function GetAuthTokens() {
  const raw_tokens = localStorage.getItem('authTokens');
  if (raw_tokens) {
    const authTokens: authTokens = JSON.parse(raw_tokens);
    return authTokens;
  }
  return null;
}

export async function SendMessage(
  isError: boolean,
  method: string,
  module_name: string,
  next: (state: boolean, message: string, color: string) => void
) {
  let message = 'Created';
  let error_message = 'Creating';

  if (method === 'PUT') {
    message = 'Updated';
    error_message = 'Updating';
  } else if (method === 'DELETE') {
    message = 'Deleted';
    error_message = 'Deleting';
  }
  if (!isError) {
    next(true, `Successfully ${message} ${module_name}`, 'success');
    return;
  }
  next(true, `Error ${error_message} ${module_name}`, 'error');
}

export function getLocaleStorageItem(
  key: string,
  defaultValue: any = null,
  renderCells: { [key: string]: (params: any) => JSX.Element } = {},
  valueGetters: { [key: string]: (params: any) => any } = {}
) {
  const item = localStorage.getItem(key);
  const result = item ? JSON.parse(item) : null;
  if (result) {
    result.forEach((item: any) => {
      if (Object.keys(renderCells).includes(item.field)) {
        item.renderCell = renderCells[item.field];
      }
      if (Object.keys(valueGetters).includes(item.field)) {
        item.valueGetter = valueGetters[item.field];
      }
    });
    return result;
  }
  if (defaultValue) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    defaultValue.forEach((item: any) => {
      if (Object.keys(renderCells).includes(item.field)) {
        item.renderCell = renderCells[item.field];
      }
      if (Object.keys(valueGetters).includes(item.field)) {
        item.valueGetter = valueGetters[item.field];
      }
    });
    return defaultValue;
  }
  return result;
}

export function setLocaleStorageItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function roundNumber(num: number, decimalPlaces = 2) {
  if (isNaN(num)) {
    return 0;
  }
  return Number(num.toFixed(decimalPlaces));
}

export const maskDate = (date: string) => {
  let newDate = date.replace(/-/g, '');
  if (newDate.length > 2) {
    newDate = newDate.substring(0, 2) + '-' + newDate.substring(2);
  }
  if (date.length > 5) {
    newDate = newDate.substring(0, 5) + '-' + newDate.substring(5);
  }
  return newDate;
};

export const urlEncoded = (str: string) => {
  return encodeURIComponent(str);
};

export const getLastDayOfMonth = () => {
  const date = new Date();
  const rt = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];
  return rt;
};

export const convertUSAtoISO = (date: string) => {
  const [m, d, y] = date.split('-');
  return `${y}-${m}-${d}`;
};

export const getFirstDayOfMonth = () => {
  const date = new Date();
  const rt = new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  return rt;
};

export const setDateStringToCST = (date: string) => {
  if (date === '' || date === null || date === undefined) {
    return '';
  }
  const dt = new Date(date);
  dt.setHours(dt.getHours() - 6);
  const [dateCST, timeCST] = dt.toISOString().split('T');
  // dd-mm HH:MM:SS
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, m, d] = dateCST.split('-');
  // hours to 12 hour format
  const hours = Number(timeCST.split(':')[0]);
  const ampm = hours >= 12 ? 'pm' : 'am';
  const min_sec = timeCST.split('.')[0].split(':').slice(1).join(':');

  return `${m}-${d} ${hours % 12}:${min_sec} ${ampm}`;
};
