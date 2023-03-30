import { SelectChangeEvent } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

// @types.statecontext.ts
export type StateContextType = {
  setNavDrawerState: (state: boolean) => void;
  navOpen: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customer_id: number;
  setNewCustomerID: (id: number) => void;
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLink: string;
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  navLoaded: boolean;
  setNavLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  gridLoading: boolean;
  setGridLoading: React.Dispatch<React.SetStateAction<boolean>>;
  viewing: boolean;
  setViewing: React.Dispatch<React.SetStateAction<boolean>>;
  navaccordianopen: boolean;
  setNavAccordianOpen: (state: boolean) => void;
  handleChange: (
    e: React.SyntheticEvent,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => void;
  handleSelectChange: (
    e: React.SyntheticEvent | SelectChangeEvent,
    setter: React.Dispatch<React.SetStateAction<any>>,
    state?: any
  ) => void;
  setStaticValue: (
    name: string,
    value: any,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => void;
  setStaticValues: (
    values: any,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => void;
  handleDateChange: (
    e: React.SyntheticEvent,
    setter: React.Dispatch<React.SetStateAction<any>>
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
