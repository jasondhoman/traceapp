import React, {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import {
  ICustomerFormData,
  IPage,
  IResponse,
} from '../../../@types/tracetypes';
import {
  initial_page_state,
  pageReducer,
  ReducerActionType,
} from '../../../utils/reducers';

import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { StateContextType } from '../../../@types/statecontext';
import GridLoading from '../../../components/ui/GridLoading';
import LandingPage from '../../../components/ui/LandingPage';
import { StateContext } from '../../../context/StateContext';
import { getCustomer } from '../api/customer';
import CustomerProvider from '../context/Customer.Context';

const CustomerDisplay = lazy(() => import('./CustomerDisplay'));
const Customer = lazy(() => import('./Customer'));

const CustomerPage: React.FC<IPage> = ({ name }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { route_id } = useParams();

  const { setLoading, setModuleName, setViewing } = useContext(
    StateContext
  ) as StateContextType;

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

  const setCustomer = async (id: number) => {
    if (Number.isNaN(id)) {
      enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      return;
    }

    try {
      const res: IResponse<ICustomerFormData> = await getCustomer(id);
      if (res.status === 200) {
        dispatch({
          type: ReducerActionType.SET_DATA,
          payload: {
            tab_id: 2,
            tablabel: 'Update',
            disabled: true,
            data: id,
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
    if (name) {
      setModuleName(name);
    }
    setLoading(true);
    if (state.id && state.id > 0) {
      setCustomer(state.id);
    } else if (route_id) {
      try {
        setCustomer(parseInt(route_id));
        setViewing(true);
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      }
    } else {
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
    <LandingPage
      tab_id={state.tab_id ?? 1}
      handleChange={handleChange}
      disabled={state.disabled ?? false}
      tablabel={state.tablabel ?? 'Add New'}
      name="Customer"
      formSize="md"
    >
      <Suspense fallback={<GridLoading />}>
        {state.tab_id === 1 ? (
          <CustomerDisplay reducer={dispatch} />
        ) : (
          <CustomerProvider>
            <Customer customer={state.data} reducer={dispatch} id={state.id} />
          </CustomerProvider>
        )}
      </Suspense>
    </LandingPage>
  );
};
export default CustomerPage;
