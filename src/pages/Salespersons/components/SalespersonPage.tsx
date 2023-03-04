import React, { useContext, useEffect, useReducer } from 'react';
import {
  IPage,
  IResponse,
  ISalesPersonFormData,
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
import { getSalesperson } from '../api/salesperson';
import SalespersonDisplay from './SalespersonDisplay';
import SalepersonsEdit from './SalespersonForm';

const Salespersons: React.FC<IPage> = ({ name }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { route_id } = useParams();
  const { setLoading, setModuleName, setViewing } = useContext(
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

  const getSalespersons = async (id: number) => {
    if (Number.isNaN(id)) {
      enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      return;
    }

    try {
      await queryClient.fetchQuery(
        'salesperson',
        async () => {
          const res: IResponse<ISalesPersonFormData> = await getSalesperson(id);
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
  };
  useEffect(() => {
    queryClient.removeQueries('salesperson');
    setLoading(true);
    if (name) {
      setModuleName(name);
    }
    if (state.id && state.id > 0) {
      getSalespersons(state.id);
    } else if (route_id) {
      try {
        getSalespersons(parseInt(route_id));
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
      name="Salespersons"
      formSize="md"
    >
      {state.tab_id === 1 ? (
        <SalespersonDisplay reducer={dispatch} />
      ) : (
        <SalepersonsEdit prop_salesperson={state.data} reducer={dispatch} />
      )}
    </LandingPage>
  );
};
export default Salespersons;
