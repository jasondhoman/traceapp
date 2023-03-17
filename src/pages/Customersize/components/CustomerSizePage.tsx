import React, { useEffect } from 'react';
import { IPage } from '../../../@types/tracetypes';
import { ReducerActionType } from '../../../utils/reducers';

import { useParams } from 'react-router-dom';
import LandingPage from '../../../components/ui/LandingPage';
import { useCustomerSizeContext } from '../CustomerSizeContext';
import CustomerSizeDisplay from './CustomerSizeDisplay';
import CustomerSizeForm from './CustomerSizeForm';

const CustomerSize: React.FC<IPage> = ({ name }) => {
  const { route_id } = useParams();

  const { state, dispatch, setRouteID } = useCustomerSizeContext();

  const handleChange = (event: React.SyntheticEvent, value: any) => {
    dispatch({
      type: ReducerActionType.SET_TAB_ID,
      payload: {
        tab_id: value,
      },
    });
  };

  useEffect(() => {
    if (route_id) {
      setRouteID(parseInt(route_id));
    }
  }, [route_id, setRouteID]);

  return (
    <LandingPage
      tab_id={state.tab_id ?? 1}
      handleChange={handleChange}
      disabled={state.disabled ?? false}
      tablabel={state.tablabel ?? 'Add New'}
      name="Customer Size"
      formSize="md"
    >
      {state.tab_id === 1 ? <CustomerSizeDisplay /> : <CustomerSizeForm />}
    </LandingPage>
  );
};
export default CustomerSize;
