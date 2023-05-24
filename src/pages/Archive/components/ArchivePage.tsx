import React, {
  Suspense,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import {
  ReducerActionType,
  initial_page_state,
  pageReducer,
} from '../../../utils/reducers';

import { Container, Grid, Tab, Tabs } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { StateContextType } from '../../../@types/statecontext';
import GridLoading from '../../../components/ui/GridLoading';
import { StateContext } from '../../../context/StateContext';
import { getArchivedOrder } from '../api/archive';

const ArchiveDisplay = lazy(() => import('./ArchiveDisplay'));
const ArchiveForm = lazy(() => import('./ArchiveForm'));

const CertificationPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { route_id } = useParams();
  const { setLoading, setModuleName, setViewing } = useContext(
    StateContext
  ) as StateContextType;

  const [state, dispatch] = useReducer(pageReducer, {
    ...initial_page_state,
    tab_id: 1,
    id: null,
    tablabel: 'View',
    disabled: false,
    moduleName: '',
  });

  const getData = useCallback(
    async (id: number) => {
      if (Number.isNaN(id)) {
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
        return;
      }

      try {
        const res = await getArchivedOrder(id);
        if (res.status === 200) {
          dispatch({
            type: ReducerActionType.SET_DATA,
            payload: {
              tab_id: 2,
              tablabel: 'View',
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
              tablabel: 'View',
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

  const handleChange = (event: React.SyntheticEvent, value: any) => {
    if (value)
      dispatch({
        type: ReducerActionType.SET_TAB_ID,
        payload: {
          tab_id: value,
        },
      });
  };

  useEffect(() => {
    setLoading(true);

    if (state.id && state.id > 0) {
      getData(state.id);
    } else {
      dispatch({
        type: ReducerActionType.SET_DATA,
        payload: {
          data: null,
          tab_id: 1,
          tablabel: 'View',
          disabled: false,
          id: null,
        },
      });
    }
    setLoading(false);
  }, [
    enqueueSnackbar,
    getData,
    route_id,
    setLoading,
    setModuleName,
    setViewing,
    state.id,
  ]);

  return (
    <Container className="mt-2 mx-0 px-0" maxWidth={false}>
      <Tabs
        value={state.tab_id}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="primary tabs example"
      >
        <Tab value={1} label={`Display Archive`} />
        <Tab value={2} label={`View Archive`} disabled={true} />
      </Tabs>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Container className="mt-2 mx-0 px-0" maxWidth={'xl'}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Container className="mt-2 mx-0 px-0" maxWidth={'lg'}>
              <Suspense fallback={<GridLoading />}>
                {state.tab_id === 1 ? (
                  <ArchiveDisplay reducer={dispatch} />
                ) : (
                  <ArchiveForm prop_order={state.data} reducer={dispatch} />
                )}
              </Suspense>
            </Container>
          </Grid>
        </Container>
      </Grid>
    </Container>
  );
};
export default CertificationPage;
