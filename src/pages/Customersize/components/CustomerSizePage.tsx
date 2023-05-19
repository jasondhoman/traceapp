import React, { useContext, useEffect } from 'react';
import { IPage } from '../../../@types/tracetypes';
import { ReducerActionType } from '../../../utils/reducers';

import { useSnackbar } from 'notistack';
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

  const handleChange = (event: React.SyntheticEvent, value: any) => {
    dispatch({
      type: ReducerActionType.SET_TAB_ID,
      payload: {
        tab_id: value,
      },
    });
  };

  useEffect(() => {
    setLoading(true);
    if (name) {
      setModuleName(name);
    }
    if (state.id && state.id > 0) {
      setGradeID(state.id);
    } else if (route_id) {
      try {
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
