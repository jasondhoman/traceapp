import { MutationFunction, useMutation, useQueryClient } from 'react-query';

import { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import { StateContextType } from '../@types/statecontext';
import { StateContext } from '../context/StateContext';

interface UseQueryMutation {
  mutator: MutationFunction<AxiosResponse<any, any>>;
  method: string;
  query: string;
  errorClosure?: (error: any) => void | null;
  cleanClosure?: (error: any) => void | null;
}

const useQueryMutation = ({
  mutator,
  method,
  query,
  errorClosure,
  cleanClosure,
}: UseQueryMutation) => {
  const { setLoading, moduleName } = useContext(
    StateContext
  ) as StateContextType;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const updateMutation = useMutation(mutator, {
    onMutate: (data) => {
      // log if in development mode
      if (import.meta.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-restricted-syntax
        console.log(data);
      }
    },
    onSuccess: (data) => {
      const queries = query.split(',');
      queries.forEach((query) => {
        queryClient.invalidateQueries(query);
      });
      if (cleanClosure) {
        cleanClosure(data);
      }
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: (res) => {
      SendMessage(res?.status !== 200, method, moduleName);
      setLoading(false);
      if (errorClosure) errorClosure(res);
    },
  });

  function SendMessage(isError: boolean, method: string, module_name: string) {
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
      enqueueSnackbar(`Successfully ${message} ${module_name}`, {
        variant: `success`,
      });
      return;
    }
    enqueueSnackbar(`Error ${error_message} ${module_name}`, {
      variant: 'error',
    });
  }

  return updateMutation;
};
export default useQueryMutation;
