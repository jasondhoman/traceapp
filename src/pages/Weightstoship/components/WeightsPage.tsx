import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import {
  IPage,
  IResponse,
  IWeightsToShipOut,
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
import { getWeight } from '../api/weightstoship';
import WeightsDisplay from './WeightsDisplay';
import WeightsForm from './WeightsForm';

const WeightsPage: React.FC<IPage> = ({ name }) => {
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

  const getWeightData = useCallback(
    async (id: number) => {
      if (Number.isNaN(id)) {
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
        return;
      }
      setLoading(true);

      try {
        const res: IResponse<IWeightsToShipOut> = await getWeight(id);

        if (res.status === 200) {
          dispatch({
            type: ReducerActionType.SET_DATA,
            payload: {
              tab_id: 2,
              tablabel: 'Update',
              disabled: true,
              data: res.data,
              id: res.data?.tracking,
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
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      }
    },
    [enqueueSnackbar, setLoading]
  );

  useEffect(() => {
    queryClient.removeQueries('weight');
    if (name) {
      setModuleName(name);
    }
    setLoading(true);
    if (state.id && state.id > 0) {
      getWeightData(state.id);
    } else if (route_id) {
      try {
        getWeightData(parseInt(route_id));
      } catch (err) {
        enqueueSnackbar('error parsing params', { variant: 'error' });
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
  }, [
    enqueueSnackbar,
    getWeightData,
    queryClient,
    route_id,
    setLoading,
    state.id,
    name,
    setModuleName,
  ]);

  return (
    <LandingPage
      tab_id={state.tab_id ?? 1}
      handleChange={handleChange}
      disabled={state.disabled ?? false}
      tablabel={state.tablabel ?? 'Add New'}
      name="Weights to Ship"
      formSize="md"
    >
      {state.tab_id === 1 ? (
        <WeightsDisplay reducer={dispatch} />
      ) : (
        <WeightsForm prop_ship={state.data} reducer={dispatch} />
      )}
    </LandingPage>
  );
};
export default WeightsPage;
