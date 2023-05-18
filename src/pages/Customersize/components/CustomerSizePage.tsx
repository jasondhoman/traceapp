import React, { useContext, useEffect } from 'react';
import { IPage } from '../../../@types/tracetypes';
import { ReducerActionType } from '../../../utils/reducers';

import { useSnackbar } from 'notistack';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { StateContextType } from '../../../@types/statecontext';
import LandingPage from '../../../components/ui/LandingPage';
import { StateContext } from '../../../context/StateContext';
import { useCustomerSizeContext } from '../CustomerSizeContext';
import CustomerSizeDisplay from './CustomerSizeDisplay';
import CustomerSizeForm from './CustomerSizeForm';

const CustomerSize: React.FC<IPage> = ({ name }) => {
  const { state, dispatch, setGradeID, selectedGrade } =
    useCustomerSizeContext();
  const { enqueueSnackbar } = useSnackbar();
  const { route_id } = useParams();
  const { setLoading, setModuleName } = useContext(
    StateContext
  ) as StateContextType;

  const queryClient = useQueryClient();

  // const [state, dispatch] = useReducer(pageReducer, {
  //   ...initial_page_state,
  //   tab_id: 1,
  //   id: null,
  //   tablabel: 'Add New',
  //   disabled: false,
  // });

  const handleChange = (event: React.SyntheticEvent, value: any) => {
    dispatch({
      type: ReducerActionType.SET_TAB_ID,
      payload: {
        tab_id: value,
      },
    });
  };

  // const getCustomersizeRecord = useCallback(
  //   async (id: number) => {
  //     if (Number.isNaN(id)) {
  //       enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
  //       return;
  //     }

  //     try {
  //       // await queryClient.fetchQuery(
  //       //   'customersize',
  //       //   async () => {
  //       const res: IResponse<ICustomerSize> = await getCustomerSize(id);
  //       if (res.status === 200) {
  //         dispatch({
  //           type: ReducerActionType.SET_DATA,
  //           payload: {
  //             tab_id: 2,
  //             tablabel: 'Update',
  //             disabled: true,
  //             data: res.data,
  //           },
  //         });
  //         if (res.data && res.data.customer_id) {
  //           setSelectedCustomer(res.data.customer_id);
  //         }
  //         return res.data;
  //       } else {
  //         enqueueSnackbar(`${res.message}`, { variant: 'error' });
  //         setLoading(false);
  //         dispatch({
  //           type: ReducerActionType.SET_ERROR,
  //           payload: {
  //             data: null,
  //             tab_id: 1,
  //             tablabel: 'Add New',
  //             disabled: false,
  //             id: null,
  //           },
  //         });
  //       }
  //       return null;
  //       //   },
  //       //   {
  //       //     cacheTime: 900000,
  //       //   }
  //       // );
  //     } catch (err) {
  //       console.error(err);
  //       enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
  //     }
  //   },
  //   [enqueueSnackbar, queryClient, setSelectedCustomer, setLoading]
  // );

  useEffect(() => {
    setLoading(true);
    if (name) {
      setModuleName(name);
    }
    if (state.id && state.id > 0) {
      // getCustomersizeRecord(state.id);
      setGradeID(state.id);
    } else if (route_id) {
      try {
        // getCustomersizeRecord(parseInt(route_id));
        setGradeID(parseInt(route_id));
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      }
    } else {
      setGradeID(null);
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
    dispatch,
    enqueueSnackbar,
    name,
    queryClient,
    route_id,
    setGradeID,
    setLoading,
    setModuleName,
    state.id,
  ]);

  return (
    <LandingPage
      tab_id={state.tab_id ?? 1}
      handleChange={handleChange}
      disabled={state.disabled ?? false}
      tablabel={state.tablabel ?? 'Add New'}
      name="Customer Size"
      formSize="md"
    >
      {state.tab_id === 1 ? (
        <CustomerSizeDisplay reducer={dispatch} />
      ) : (
        <CustomerSizeForm reducer={dispatch} />
      )}
    </LandingPage>
  );
};
export default CustomerSize;
