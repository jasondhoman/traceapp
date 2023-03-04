import axios, { AxiosError } from 'axios';

import { GetAuthTokens } from '../../../utils/Helpers';

const tokens = GetAuthTokens();

const detailAPI = axios.create({
  baseURL:
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import.meta.env.NODE_ENV === 'development'
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        import.meta.env.VITE_API_DEV_ROOT
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        import.meta.env.VITE_API_ROOT,
  headers: {
    Authorization: tokens?.refresh ?? '',
  },
});

export const getUserByID = async (id: number) => {
  const response = await detailAPI.post('/user', {
    id,
  });
  return response.data;
};

export async function getDetailByID(id: number) {
  try {
    const response = await detailAPI.get(`/detaillookup/${id}`);

    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    return { data: null, status: Number(error.status) };
  }
}
