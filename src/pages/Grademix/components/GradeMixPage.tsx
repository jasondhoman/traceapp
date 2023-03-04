import React, { useContext, useEffect, useReducer } from 'react';
import { IGradeMix, IPage, IResponse } from '../../../@types/tracetypes';
import {
  initial_page_state,
  pageReducer,
  ReducerActionType,
} from '../../../utils/reducers';

import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { StateContextType } from '../../../@types/statecontext';
import LandingPage from '../../../components/ui/LandingPage';
import { StateContext } from '../../../context/StateContext';
import { getGradeMix } from '../api/grademix';
import GradeMixDisplay from './GradeMixDisplay';
import GradeMixForm from './GradeMixForm';

const GradeMix: React.FC<IPage> = ({ name }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { route_id } = useParams();
  const { setLoading, setModuleName } = useContext(
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

  const getGradeMixData = async (id: number) => {
    if (Number.isNaN(id)) {
      enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      return;
    }
    setLoading(true);

    try {
      const res: IResponse<IGradeMix> = await getGradeMix(id);
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
  };
  useEffect(() => {
    setLoading(true);
    if (name) {
      setModuleName(name);
    }
    if (state.id && state.id > 0) {
      getGradeMixData(state.id);
    } else if (route_id) {
      try {
        getGradeMixData(parseInt(route_id));
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
      name="Grade Mix"
      formSize="md"
    >
      {state.tab_id === 1 ? (
        <GradeMixDisplay reducer={dispatch} />
      ) : (
        <GradeMixForm prop_grade_mix={state.data} reducer={dispatch} />
      )}
    </LandingPage>
  );
};
export default GradeMix;
