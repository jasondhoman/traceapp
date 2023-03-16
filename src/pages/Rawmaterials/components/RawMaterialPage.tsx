import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import {
  IPage,
  IRawMaterialFormData,
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
import { getRawMaterial } from '../api/rawmaterial';
import RawMaterialDisplay from './RawMaterialsDisplay';
import RawMaterialsForm from './RawMaterialsForm';

const RawMaterial: React.FC<IPage> = ({ name }) => {
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
  const getRawMaterials = useCallback(
    async (id: number) => {
      if (Number.isNaN(id)) {
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
        return;
      }

      setLoading(true);

      try {
        const res: IResponse<IRawMaterialFormData> = await getRawMaterial(id);
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
        enqueueSnackbar('Error Retrieving Data' + err, { variant: 'error' });
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
      getRawMaterials(state.id);
    } else if (route_id) {
      try {
        getRawMaterials(parseInt(route_id));
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      }
    } else {
      queryClient.removeQueries('rawmaterial');
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
    getRawMaterials,
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
      disabled={state.disabled ?? false}
      tablabel={state.tablabel ?? 'Add New'}
      name="Raw Materials"
      formSize="md"
    >
      {state.tab_id === 1 ? (
        <RawMaterialDisplay reducer={dispatch} />
      ) : (
        <RawMaterialsForm prop_raw_material={state.data} reducer={dispatch} />
      )}
    </LandingPage>
  );
};
export default RawMaterial;
