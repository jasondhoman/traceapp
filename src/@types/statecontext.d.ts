import { SelectChangeEvent } from '@mui/material';
import { Dispatch, SetStateAction, SyntheticEvent } from 'react';

// @types.statecontext.ts
export type StateContextType = {
  setNavDrawerState: (state: boolean) => void;
  navOpen: boolean;
  setNavOpen: Dispatch<SetStateAction<boolean>>;
  customer_id: number;
  setNewCustomerID: (id: number) => void;
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  selectedLink: string;
  setSelectedLink: Dispatch<SetStateAction<string>>;
  navLoaded: boolean;
  setNavLoaded: Dispatch<SetStateAction<boolean>>;
  gridLoading: boolean;
  setGridLoading: Dispatch<SetStateAction<boolean>>;
  viewing: boolean;
  setViewing: Dispatch<SetStateAction<boolean>>;
  navaccordianopen: boolean;
  setNavAccordianOpen: (state: boolean) => void;
  handleChange: (
    e: SyntheticEvent,
    setter: Dispatch<SetStateAction<any>>
  ) => void;
  handleSelectChange: (
    e: SyntheticEvent | SelectChangeEvent,
    setter: Dispatch<SetStateAction<any>>,
    state?: any
  ) => void;
  setStaticValue: (
    name: string,
    value: any,
    setter: Dispatch<SetStateAction<any>>
  ) => void;
  setStaticValues: (values: any, setter: Dispatch<SetStateAction<any>>) => void;
  handleDateChange: (
    e: SyntheticEvent,
    setter: Dispatch<SetStateAction<any>>
  ) => void;
  setNavAdminOpen: (state: boolean) => void;
  setNavReportOpen: (state: boolean) => void;
  setNavDashboardOpen: (state: boolean) => void;
  setNavArchiveOpen: (state: boolean) => void;
  navadminexpanded: boolean;
  navreportexpanded: boolean;
  navarchiveexpanded: boolean;
  navdashboardexpanded: boolean;
  moduleName: string;
  setModuleName: Dispatch<SetStateAction<string>>;
};
