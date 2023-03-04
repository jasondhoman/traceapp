import React, {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { ICertification, IResponse } from '../../../@types/tracetypes';
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
import { getCertificate } from '../api/certifications';

const CertificationDisplay = lazy(() => import('./CertificationsDisplay'));
const CertificationForm = lazy(() => import('./CertificationsForm'));

interface ICertificationPage {
  name: string;
}

const CertificationPage: React.FC<ICertificationPage> = ({ name }) => {
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

  const GetCertification = async (id: number) => {
    if (Number.isNaN(id)) {
      enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      return;
    }

    try {
      const res: IResponse<ICertification> = await getCertificate(id);
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
      GetCertification(state.id);
    } else if (route_id) {
      try {
        GetCertification(parseInt(route_id));
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
      name="Certifications"
      formSize="md"
    >
      <Suspense fallback={<GridLoading />}>
        {state.tab_id === 1 ? (
          <CertificationDisplay reducer={dispatch} />
        ) : (
          <CertificationForm
            reducer={dispatch}
            id={state.id ?? undefined}
            p_certification={state.data}
          />
        )}
      </Suspense>
    </LandingPage>
  );
};
export default CertificationPage;
