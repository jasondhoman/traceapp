import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import {
  IPage,
  IProductionFormData,
  IResponse,
} from '../../../@types/tracetypes';
import {
  initial_page_state,
  pageReducer,
  ReducerActionType,
} from '../../../utils/reducers';

import { useSnackbar } from 'notistack';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { StateContextType } from '../../../@types/statecontext';
import LandingPage from '../../../components/ui/LandingPage';
import { StateContext } from '../../../context/StateContext';
import { getProductionInformation } from '../api/order';
import ProductionInformationDisplay from './ProductionInformationDisplay';
import ProductionInformationForm from './ProductionInformationForm';

const ProductionInformation: React.FC<IPage> = ({ name }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { route_id } = useParams();
  const { setLoading, setModuleName } = useContext(
    StateContext
  ) as StateContextType;

  const queryClient = useQueryClient();
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
  const getOrder = useCallback(
    async (id: number) => {
      if (Number.isNaN(id)) {
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
        return;
      }

      setLoading(true);
      try {
        const res: IResponse<IProductionFormData> =
          await getProductionInformation(id);
        if (res.status === 200) {
          console.log(res.data);
          if (res.data?.missing_weight_sheet) {
            enqueueSnackbar(
              `Tracking ${res.data.tracking} is missing a weight sheet. Please create one.`,
              { variant: 'warning' }
            );
          } else {
            dispatch({
              type: ReducerActionType.SET_DATA,
              payload: {
                tab_id: 2,
                tablabel: 'Update',
                disabled: true,
                data: res.data,
              },
            });
          }
          return res.data;
        } else {
          enqueueSnackbar(`${res.message}`, { variant: 'error' });
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
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar, setLoading]
  );

  useEffect(() => {
    setLoading(true);
    if (name) {
      setModuleName(name);
    }
    if (state.id && state.id > 0) {
      getOrder(state.id);
    } else if (route_id) {
      try {
        getOrder(parseInt(route_id));
      } catch (err) {
        enqueueSnackbar('Error Retrieving Production Information', {
          variant: 'error',
        });
      }
    } else {
      queryClient.removeQueries('prod_info');
      dispatch({
        type: ReducerActionType.SET_DATA,
        payload: {
          data: null,
          tab_id: 1,
          tablabel: 'Update',
          disabled: false,
          id: null,
        },
      });
    }
    setLoading(false);
  }, [
    enqueueSnackbar,
    getOrder,
    name,
    queryClient,
    route_id,
    setLoading,
    setModuleName,
    state.id,
  ]);

  return (
    <LandingPage
      tab_id={state.tab_id ?? 1}
      handleChange={handleChange}
      disabled={true}
      tablabel={state.tablabel ?? 'Update'}
      name="Production Information"
      formSize="md"
    >
      {state.tab_id === 1 ? (
        <ProductionInformationDisplay reducer={dispatch} />
      ) : (
        <ProductionInformationForm
          prop_order={state.data}
          reducer={dispatch}
          getOrder={getOrder}
        />
      )}
    </LandingPage>
  );
};
export default ProductionInformation;
