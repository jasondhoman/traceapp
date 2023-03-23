import { useSnackbar } from 'notistack';
import React, {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { ICustomerSize, IResponse } from '../../@types/tracetypes';
import {
  initial_page_state,
  IPageState,
  pageReducer,
  ReducerActionType,
  SetPageState,
} from '../../utils/reducers';
import { getCustomerSize, getCustomerSizes } from './api/customersize';

export interface CustomeSizeContext {
  hello: string;
  queueIDs: number[];
  isLoading: boolean;
  customersizes: ICustomerSize[] | undefined;
  gradeID: number | null;
  setGradeID: Dispatch<SetStateAction<number | null>>;
  setSelectedCustomer: Dispatch<SetStateAction<number | null>>;
  handleSizeChange: (next?: boolean) => void;
  tagSizes: string[];
  state: IPageState;
  dispatch: Dispatch<SetPageState>;
  cancelEditCleanup: () => void;
  routeID: number | null;
  setRouteID: Dispatch<SetStateAction<number | null>>;
  grades: string[];
}

const CustomerSizeContext = createContext<CustomeSizeContext | null>(null);

const CustomerSizeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [queueIDs, setQueueIDs] = useState<number[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);

  const [tagSizes, setTagSizes] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);

  const [gradeID, setGradeID] = useState<number | null>(null);
  const [routeID, setRouteID] = useState<number | null>(null);

  const [state, dispatch] = useReducer(pageReducer, {
    ...initial_page_state,
    tab_id: 1,
    id: null,
    tablabel: 'Add New',
    disabled: false,
  });

  const { isLoading, data: customersizes } = useQuery<ICustomerSize[]>(
    'customersizes',
    getCustomerSizes
  );

  const cancelEditCleanup = useCallback(() => {
    setSelectedCustomer(null);
    setGradeID(null);
    setQueueIDs([]);
    setTagSizes([]);
    queryClient.removeQueries('customersize');
    queryClient.invalidateQueries('customersizes');
  }, [queryClient]);

  const getGrade = useCallback(
    async (id: number) => {
      try {
        await queryClient.fetchQuery('customersize', async () => {
          const res: IResponse<ICustomerSize> = await getCustomerSize(id);
          if (res.status === 200) {
            if (res.data && res.data.customer_id) {
              setSelectedCustomer(res.data.customer_id);
            }
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
        });
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Error Retrieving Data', { variant: 'error' });
      }
    },
    [enqueueSnackbar, queryClient]
  );

  const handleSizeChange = useCallback(
    (next = false) => {
      if (gradeID) {
        const nextIndex = queueIDs.indexOf(gradeID) + (next ? 1 : -1);
        if (nextIndex >= 0 && nextIndex < queueIDs.length) {
          setGradeID(queueIDs[nextIndex]);
        }
      }
    },
    [gradeID, queueIDs]
  );

  useEffect(() => {
    setQueueIDs(
      customersizes
        ?.filter((c) => c.customer_id === selectedCustomer)
        ?.map((i) => i.id) || []
    );
    const grades: string[] = [];
    const filteredTagsizes: string[] = [];
    customersizes?.forEach((c) => {
      if (c.customer_id === selectedCustomer) {
        if (!filteredTagsizes.includes(c.tag_size)) {
          filteredTagsizes.push(c.tag_size);
        }
        if (!grades.includes(c.grade)) {
          grades.push(c.grade);
        }
      }
    });
    setGrades(grades);
    setTagSizes(filteredTagsizes.sort((a, b) => a.localeCompare(b)));
  }, [customersizes, selectedCustomer]);

  useEffect(() => {
    async function fetchData() {
      if (gradeID) {
        await getGrade(gradeID);
      } else if (routeID) {
        await getGrade(routeID);
      }
    }
    fetchData();
  }, [gradeID, getGrade, routeID]);

  return (
    <CustomerSizeContext.Provider
      value={{
        hello: 'world',
        queueIDs,
        isLoading,
        customersizes,
        setSelectedCustomer,
        gradeID,
        setGradeID,
        handleSizeChange,
        tagSizes,
        state,
        dispatch,
        cancelEditCleanup,
        routeID,
        setRouteID,
        grades,
      }}
    >
      {children}
    </CustomerSizeContext.Provider>
  );
};

export default CustomerSizeProvider;

export const useCustomerSizeContext = () => {
  const context = useContext(CustomerSizeContext) as CustomeSizeContext;
  if (context === undefined) {
    throw new Error(
      'useCustomerSizeContext must be used within a CustomerSizeProvider'
    );
  }
  return context;
};
