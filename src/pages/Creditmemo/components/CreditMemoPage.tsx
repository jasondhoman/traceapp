import React, {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { ICreditMemoFormData, IResponse } from '../../../@types/tracetypes';
import {
  initial_page_state,
  pageReducer,
  ReducerActionType,
} from '../../../utils/reducers';

import { useSnackbar } from 'notistack';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { StateContextType } from '../../../@types/statecontext';
import GridLoading from '../../../components/ui/GridLoading';
import LandingPage from '../../../components/ui/LandingPage';
import { StateContext } from '../../../context/StateContext';
import { getCreditMemo } from '../api/creditmemo';

const CreditMemoDisplay = lazy(() => import('./CreditMemoDisplay'));
const CreditMemoForm = lazy(() => import('./CreditMemoForm'));

interface ICreditMemosFC {
  name: string;
}
const CreditMemos: React.FC<ICreditMemosFC> = ({ name }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { route_id } = useParams();

  const { setLoading, setModuleName } = useContext(
    StateContext
  ) as StateContextType;

  if (name) {
    setModuleName(name);
  }

  const [state, dispatch] = useReducer(pageReducer, {
    ...initial_page_state,
    tab_id: 1,
    id: null,
    tablabel: 'Add New',
    disabled: false,
  });

  const handleChange = (event: React.SyntheticEvent, value: any) => {
    dispatch({
      type: ReducerActionType.SET_TAB_ID,
      payload: {
        tab_id: value,
      },
    });
  };

  const getCreditMemoData = useCallback(
    async (id: number) => {
      if (Number.isNaN(id)) {
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
        return;
      }
      setLoading(true);

      try {
        await queryClient.fetchQuery(
          'memo',
          async () => {
            const res: IResponse<ICreditMemoFormData> = await getCreditMemo(id);

            if (res.status === 200) {
              dispatch({
                type: ReducerActionType.SET_DATA,
                payload: {
                  tab_id: 2,
                  tablabel: 'Update',
                  disabled: true,
                  data: res.data,
                },
              });
              return res.data;
            } else {
              enqueueSnackbar(`${res.message}`, { variant: 'error' });
              setLoading(false);
              dispatch({
                type: ReducerActionType.SET_ERROR,
                payload: {
                  data: null,
                  tab_id: 1,
                  tablabel: 'Add New',
                  disabled: false,
                  id: null,
                },
              });
            }
            return null;
          },
          {
            staleTime: 30000,
          }
        );
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      }
    },
    [enqueueSnackbar, setLoading, queryClient]
  );

  useEffect(() => {
    setLoading(true);
    if (state.id && state.id > 0) {
      getCreditMemoData(state.id);
    } else if (route_id) {
      try {
        getCreditMemoData(parseInt(route_id));
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      }
    } else {
      queryClient.removeQueries('memo');
      dispatch({
        type: ReducerActionType.SET_DATA,
        payload: {
          data: null,
          tab_id: 1,
          tablabel: 'Add New',
          disabled: false,
          id: null,
        },
      });
    }
    setLoading(false);
  }, [
    enqueueSnackbar,
    getCreditMemoData,
    queryClient,
    route_id,
    setLoading,
    state.id,
  ]);

  return (
    <LandingPage
      tab_id={state.tab_id ?? 1}
      handleChange={handleChange}
      disabled={state.disabled ?? false}
      tablabel={state.tablabel ?? 'Add New'}
      name="Credit Memos"
      formSize="md"
    >
      <Suspense fallback={<GridLoading />}>
        {state.tab_id === 1 ? (
          <CreditMemoDisplay reducer={dispatch} />
        ) : (
          <CreditMemoForm prop_credit_memo={state.data} reducer={dispatch} />
        )}
      </Suspense>
    </LandingPage>
  );
};
export default CreditMemos;
