import React, {
  lazy,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { IResponse } from '../../../@types/tracetypes';
import {
  ReducerActionType,
  initial_page_state,
  pageReducer,
} from '../../../utils/reducers';

import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { StateContextType } from '../../../@types/statecontext';
import LandingPage from '../../../components/ui/LandingPage';
import { StateContext } from '../../../context/StateContext';
import { getArchivedOrder } from '../api/archive';
import ArchiveForm from './ArchiveForm';

const ArchiveDisplay = lazy(() => import('./ArchiveDisplay'));

interface ICertificationPage {
  name: string;
}

const ArchivePage: React.FC<ICertificationPage> = ({ name }) => {
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
    moduleName: name,
  });

  const handleChange = (event: React.SyntheticEvent, value: any) => {
    if (value)
      dispatch({
        type: ReducerActionType.SET_TAB_ID,
        payload: {
          tab_id: value,
        },
      });
  };

  const getArchivedOrderData = useCallback(
    async (id: number) => {
      if (Number.isNaN(id)) {
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
        return;
      }

      try {
        const res: IResponse<any> = await getArchivedOrder(id);
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
    },
    [enqueueSnackbar, setLoading]
  );

  useEffect(() => {
    setLoading(true);
    if (name) {
      setModuleName(name);
    }
    if (state.id && state.id > 0) {
      getArchivedOrderData(state.id);
    } else if (route_id) {
      try {
        getArchivedOrderData(parseInt(route_id));
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
  }, [
    getArchivedOrderData,
    enqueueSnackbar,
    name,
    route_id,
    setLoading,
    setModuleName,
    setViewing,
    state.id,
  ]);

  return (
    // <Container className="mt-2 mx-0 px-0" maxWidth={false}>
    //   <Tabs
    //     value={1}
    //     textColor="primary"
    //     indicatorColor="primary"
    //     aria-label="primary tabs example"
    //   >
    //     <Tab value={1} label={`Display Archive`} />
    //   </Tabs>

    //   <Grid
    //     container
    //     direction="row"
    //     justifyContent="center"
    //     alignItems="center"
    //   >
    //     <Container className="mt-2 mx-0 px-0" maxWidth={'lg'}>
    //       <Suspense fallback={<GridLoading />}>
    //         <ArchiveDisplay reducer={dispatch} />
    //       </Suspense>
    //     </Container>
    //   </Grid>
    // </Container>
    <LandingPage
      tab_id={state.tab_id ?? 1}
      handleChange={handleChange}
      disabled={false}
      tablabel={'View'}
      name="Archived Order"
      formSize="xl"
      tabTwoDisabled={true}
    >
      {state.tab_id === 1 ? (
        <ArchiveDisplay reducer={dispatch} />
      ) : (
        <ArchiveForm prop_order={state.data} reducer={dispatch} />
      )}
    </LandingPage>
  );
};
export default ArchivePage;
