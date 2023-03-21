import React, { createContext, useEffect, useState } from 'react';

import { SelectChangeEvent } from '@mui/material';
import { StateContextType } from '../@types/statecontext';

export const StateContext = createContext<StateContextType | null>(null);

const StateProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [navOpen, setNavOpen] = useState(() =>
    localStorage.getItem('navOpen') === 'true' ? true : false
  );
  const [moduleName, setModuleName] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [customer_id, setCustomerID] = useState(0);
  const [selectedLink, setSelectedLink] = useState('home');
  const [navLoaded, setNavLoaded] = useState(false);
  const [gridLoading, setGridLoading] = useState(true);
  const [navaccordianopen, setNavExpanded] = useState(() => {
    const val = localStorage.getItem('navMenuExpanded');
    if (!val) {
      return true;
    }
    return localStorage.getItem('navMenuExpanded') === 'true' ? true : false;
  });

  const [navadminexpanded, setNavAdminExpanded] = useState(() => {
    const val = localStorage.getItem('navadminexpanded');
    if (!val) {
      return true;
    }
    return localStorage.getItem('navadminexpanded') === 'true' ? true : false;
  });

  const [navreportexpanded, setNavReportExpanded] = useState(() => {
    const val = localStorage.getItem('navreportexpanded');
    if (!val) {
      return true;
    }
    return localStorage.getItem('navreportexpanded') === 'true' ? true : false;
  });

  const [navarchiveexpanded, setNavArchiveExpanded] = useState(() => {
    const val = localStorage.getItem('navarchiveexpanded');
    if (!val) {
      return true;
    }
    return localStorage.getItem('navreportexpanded') === 'true' ? true : false;
  });

  const [navdashboardexpanded, setNavDashboardExpanded] = useState(() => {
    const val = localStorage.getItem('navdashboardexpanded');
    if (!val) {
      return true;
    }
    return localStorage.getItem('navdashboardexpanded') === 'true'
      ? true
      : false;
  });

  const [viewing, setViewing] = useState(false);

  const setNavDrawerState = (state: boolean) => {
    if (state) {
      setNavOpen(true);
      localStorage.setItem('navOpen', JSON.stringify(state));
    } else {
      setNavOpen(false);
      localStorage.setItem('navOpen', JSON.stringify('false'));
    }
  };

  const setNavAccordianOpen = (state: boolean) => {
    if (state) {
      setNavExpanded(true);
      localStorage.setItem('navMenuExpanded', JSON.stringify(state));
    } else {
      setNavExpanded(false);
      localStorage.setItem('navMenuExpanded', JSON.stringify('false'));
    }
  };

  const setNavAdminOpen = (state: boolean) => {
    if (state) {
      setNavAdminExpanded(true);
      localStorage.setItem('navadminexpanded', JSON.stringify(state));
    } else {
      setNavAdminExpanded(false);
      localStorage.setItem('navadminexpanded', JSON.stringify('false'));
    }
  };

  const setNavReportOpen = (state: boolean) => {
    if (state) {
      setNavReportExpanded(true);
      localStorage.setItem('navreportexpanded', JSON.stringify(state));
    } else {
      setNavReportExpanded(false);
      localStorage.setItem('navreportexpanded', JSON.stringify('false'));
    }
  };

  const setNavDashboardOpen = (state: boolean) => {
    if (state) {
      setNavDashboardExpanded(true);
      localStorage.setItem('navdashboardexpanded', JSON.stringify(state));
    } else {
      setNavDashboardExpanded(false);
      localStorage.setItem('navdashboardexpanded', JSON.stringify('false'));
    }
  };
  const setNavArchiveOpen = (state: boolean) => {
    if (state) {
      setNavArchiveExpanded(true);
      localStorage.setItem('navarchiveexpanded', JSON.stringify(state));
    } else {
      setNavArchiveExpanded(false);
      localStorage.setItem('navarchiveexpanded', JSON.stringify('false'));
    }
  };

  const setNewCustomerID = (id: number) => setCustomerID(id);

  const handleChange = (
    e: React.SyntheticEvent,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setter((prev: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (import.meta.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-restricted-syntax
        console.log(
          `Value Change Event fired for name: ${target.name} value change ${
            prev[target.name]
          } 👉 ${value}`
        );
      }
      return { ...prev, [target.name]: value };
    });
  };

  const handleSelectChange = (
    e: React.SyntheticEvent | SelectChangeEvent,
    setter: React.Dispatch<React.SetStateAction<any>>,
    state: any = null
  ) => {
    const target = e.target as HTMLSelectElement;
    let value: any = target.value;
    if (state && typeof state[target.name] === 'number') {
      value = parseFloat(value);
    }
    setter((prev: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (import.meta.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-restricted-syntax
        console.log(
          `Select Event fired for name: ${target.name} value change ${
            prev[target.name]
          } 👉 ${value}`
        );
      }
      return { ...prev, [target.name]: value };
    });
  };

  const setStaticValue = (
    name: string,
    value: any,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setter((prev: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (import.meta.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-restricted-syntax
        console.log(
          `Static Value Set Event fired for name: ${name} value change ${prev[name]} 👉 ${value}`
        );
      }
      return { ...prev, [name]: value };
    });
  };
  const setStaticValues = (
    values: any,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setter((prev: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (import.meta.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-restricted-syntax
        console.log(
          `Static Values Set Event fired for values: ${JSON.stringify(values)}`
        );
      }
      return { ...prev, ...values };
    });
  };
  const handleDateChange = (
    e: React.SyntheticEvent,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const target = e.target as HTMLInputElement;
    if (target.value === '' || target.value === undefined) return;
    setStaticValue(target.name, new Date(target.value), setter);
  };

  const context_data = {
    setNavDrawerState: setNavDrawerState,
    navOpen: navOpen,
    customer_id: customer_id,
    setNewCustomerID: setNewCustomerID,
    isLoading: isLoading,
    setLoading: setLoading,
    selectedLink: selectedLink,
    setSelectedLink: setSelectedLink,
    navLoaded: navLoaded,
    setNavLoaded: setNavLoaded,
    gridLoading: gridLoading,
    setGridLoading: setGridLoading,
    viewing: viewing,
    setViewing: setViewing,
    navaccordianopen: navaccordianopen,
    setNavAccordianOpen: setNavAccordianOpen,
    handleChange: handleChange,
    handleSelectChange: handleSelectChange,
    setStaticValue: setStaticValue,
    setStaticValues: setStaticValues,
    handleDateChange: handleDateChange,
    navadminexpanded: navadminexpanded,
    setNavAdminOpen: setNavAdminOpen,
    navreportexpanded: navreportexpanded,
    setNavReportOpen: setNavReportOpen,
    navdashboardexpanded: navdashboardexpanded,
    setNavArchiveOpen: setNavArchiveOpen,
    navarchiveexpanded: navarchiveexpanded,
    setNavDashboardOpen: setNavDashboardOpen,
    moduleName: moduleName,
    setModuleName: setModuleName,
  };
  useEffect(() => {
    setNavDrawerState(navOpen);
  }, [navOpen]);
  return (
    <StateContext.Provider value={context_data}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
