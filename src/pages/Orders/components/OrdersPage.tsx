import React, { useContext, useEffect, useReducer } from 'react';
import { IOrderFormData, IPage, IResponse } from '../../../@types/tracetypes';
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
import { getOrder } from '../api/order';
import OrderProvider from '../context/OrderContext';
import OrdersDisplay from './OrdersDisplay';
import OrdersForm from './OrdersForm';

const Orders: React.FC<IPage> = ({ name }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { route_id } = useParams();
  const { setLoading, setModuleName } = useContext(
    StateContext
  ) as StateContextType;
  // const { contextState, dispatch } = useContext(OrderContext) as OrderContextType;

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
  const getOrderData = async (id: number) => {
    if (Number.isNaN(id)) {
      enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      return;
    }
    setLoading(true);

    try {
      const res: IResponse<IOrderFormData> = await getOrder(id);
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
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
    }
  };
  useEffect(() => {
    setLoading(true);
    if (name) {
      setModuleName(name);
    }
    if (state.id && state.id > 0) {
      getOrderData(state.id);
    } else if (route_id) {
      try {
        getOrderData(parseInt(route_id));
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      }
    } else {
      queryClient.removeQueries('order');
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
  }, [state.id]);

  return (
    <OrderProvider>
      <LandingPage
        tab_id={state.tab_id ?? 1}
        handleChange={handleChange}
        disabled={state.disabled ?? false}
        tablabel={state.tablabel ?? 'Add New'}
        name="Orders"
        formSize="xl"
      >
        {state.tab_id === 1 ? (
          <OrdersDisplay reducer={dispatch} />
        ) : (
          <OrdersForm prop_order={state.data} reducer={dispatch} />
        )}
      </LandingPage>
    </OrderProvider>
  );
};
export default Orders;
