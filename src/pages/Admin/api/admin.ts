import axios, { AxiosError } from 'axios';

import { LogMessage } from '../../../@types/tracetypes';
import { config } from '../../../utils/config';
import { GetAuthTokens } from '../../../utils/helpers';

const tokens = GetAuthTokens();

const adminAPI = axios.create({
  timeout: 5000,
  baseURL: config.VITE_API_ROOT + '/',
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

const loginAPI = axios.create({
  timeout: 5000,
  baseURL: config.VITE_API_ROOT + '/',
});

export async function getLogs(date: string): Promise<LogMessage[] | undefined> {
  try {
    const response = await adminAPI.get(`logs/${date}`);
    return response.data;
  } catch (err) {
    return undefined;
  }
}

export async function getLogDates() {
  try {
    const response = await adminAPI.get(`logdates`);
    return response.data;
  } catch (err) {
    return {};
  }
}

export async function DeleteToken(id: number) {
  try {
    const response = await adminAPI.post(`logout`, {
      token: tokens?.refresh,
      id: id,
    });
    if (response.status > 200) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function updateTokenData(token: string) {
  try {
    const response = await adminAPI.post(
      'token',
      {
        refresh: token,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function getUsers() {
  try {
    const response = await adminAPI.get('users');

    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    return { data: null, status: Number(error.status) };
  }
}

export async function getUser(id: number) {
  try {
    const response = await adminAPI.get(`user/${id}`);
    return {
      success: response.status === 200,
      data: response.data,
      status: response.status,
    };
  } catch (err) {
    const error = err as AxiosError;
    return { data: null, status: Number(error.status) };
  }
}

export async function createUser(user: any) {
  try {
    const response = await adminAPI.post('user', user);

    return {
      success: response.status === 200,
      data: response.data,
      status: response.status,
    };
  } catch (err) {
    const error = err as AxiosError;
    return { data: null, status: Number(error.status) };
  }
}

export async function updateUser(user: any) {
  try {
    const response = await adminAPI.put('user', user);

    return {
      success: response.status === 200,
      data: response.data,
      status: response.status,
    };
  } catch (err) {
    const error = err as AxiosError;
    return { data: null, status: Number(error.status) };
  }
}

export async function deleteUser(id: number) {
  try {
    const response = await adminAPI.delete(`user/${id}`);

    return {
      success: response.status === 200,
      data: response.data,
      status: response.status,
    };
  } catch (err) {
    const error = err as AxiosError;
    return { data: null, status: Number(error.status) };
  }
}

export async function updatePassword(password: string) {
  try {
    const response = await adminAPI.put('updatepassword', { password });

    return {
      success: response.status === 200,
      data: response.data,
      status: response.status,
    };
  } catch (err) {
    const error = err as AxiosError;
    return { data: null, status: Number(error.status) };
  }
}

export async function getErrors() {
  try {
    const response = await adminAPI.get('errors');
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getError(id: number) {
  try {
    const response = await adminAPI.get(`error/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function getUsernames() {
  try {
    const response = await adminAPI.get('usernames');
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export async function apiLoginUser(username: string, password: string) {
  try {
    const response = await loginAPI.post('login', {
      username: username,
      password: password,
    });
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}
