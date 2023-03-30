import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, JWTDecoded } from '../@types/authcontext';
import {
  apiLoginUser,
  DeleteToken,
  updateTokenData,
} from '../pages/Admin/api/admin';
import {
  AdminLinks,
  DashboardLinks,
  navpoints,
  ReportLinks,
} from '../utils/Constants';

import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { StateContextType } from '../@types/statecontext';
import { ILink, MessageResponse } from '../@types/tracetypes';
import { StateContext, useStateContext } from './StateContext';

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { navOpen, setNavOpen, setLoading } = useStateContext();

  const [user, setUser] = useState<JWTDecoded | null>(() =>
    localStorage.getItem('authTokens')
      ? jwtDecode(localStorage.getItem('authTokens') ?? '{}')
      : null
  );

  const [isAdmin] = useState(user?.role && user.role < 3 ? true : false);

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens') ?? '{}')
      : null
  );
  const [loading, setAuthLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [statusLevel, setStatusLevel] =
    useState<AuthContextType['statusLevel']>('info');
  const [authenticated, setAuthenticated] = useState(
    user === null ? false : true
  );
  const [links, setLinks] = useState<ILink[]>(() =>
    localStorage.getItem('links') && localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('links') ?? '')
      : []
  );

  const [reportLinks, setReportLinks] = useState<ILink[]>(() =>
    localStorage.getItem('reportlinks') && localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('reportlinks') ?? '')
      : []
  );

  const [adminLinks, setAdminLinks] = useState<ILink[]>(() =>
    localStorage.getItem('adminlinks') && localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('adminlinks') ?? '')
      : []
  );

  const [dashboardLinks, setDashboardLinks] = useState<ILink[]>(() =>
    localStorage.getItem('dashboardlinks') && localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('dashboardlinks') ?? '')
      : []
  );

  const { setNavDrawerState } = useContext(StateContext) as StateContextType;

  const navigate = useNavigate();
  const SetupLinks = async () => {
    try {
      setLinks(navpoints);
      localStorage.setItem('links', JSON.stringify(navpoints));
      setReportLinks(ReportLinks);
      localStorage.setItem('reportlinks', JSON.stringify(ReportLinks));
      setAdminLinks(AdminLinks);
      localStorage.setItem('adminlink', JSON.stringify(AdminLinks));
      setDashboardLinks(DashboardLinks);
      localStorage.setItem('dashboardlinks', JSON.stringify(DashboardLinks));
    } catch (err) {
      console.error(err);
    }
  };

  const loginUser = async (
    e: React.SyntheticEvent
  ): Promise<void | MessageResponse> => {
    setLoading(true);
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    try {
      const res = await apiLoginUser(
        target.username.value,
        target.password.value
      );

      setStatus('');
      if (res.status === 200) {
        const data = res.data;
        const user_decoded = jwtDecode(data.access) as JWTDecoded;
        setAuthTokens(data);
        setUser(user_decoded);
        localStorage.setItem('authTokens', JSON.stringify(data));
        //set auth cookies

        setAuthenticated(true);
        setStatus('');
        setStatusLevel('info');
        SetupLinks();
        if (user_decoded.reset_password) {
          setLoading(false);
          navigate('/resetpassword');
        } else {
          navigate('/');
        }
      } else {
        const data = res.response.data;
        setStatus(data.message);
        setStatusLevel('error');
      }
    } catch (err) {
      if (err.message.indexOf('timeout')) {
        setStatus('API Server Not Responding');
      } else {
        setStatus(err.message);
      }
      setStatusLevel('error');
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    if (user) {
      DeleteToken(user.id);
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem('authTokens');
      localStorage.removeItem('navOpen');
      localStorage.removeItem('links');
      navigate('/login');
      setStatus('Successfully Logged Out!');
      setNavDrawerState(false);
      setStatusLevel('success');
      setAuthenticated(false);
    }
  };

  const updateToken = async () => {
    try {
      const res = await updateTokenData(authTokens.refresh);
      if (res?.status === 201) {
        const data = res.data;
        const jwtdecoded = jwtDecode<JWTDecoded>(data.access);
        setAuthTokens(data);
        setUser(jwtdecoded);
        setAuthenticated(true);
        localStorage.setItem('authTokens', JSON.stringify(data));
      } else if (res?.status === 200) {
        setAuthenticated(true);
      } else {
        logoutUser();
      }
    } catch (err) {
      logoutUser();
    }

    if (loading) {
      setAuthLoading(false);
    }
  };

  const context_data = {
    user: user,
    setUser: setUser,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    status: status,
    statusLevel: statusLevel,
    authenticated: authenticated,
    links: links,
    reportLinks: reportLinks,
    adminLinks: adminLinks,
    dashboardLinks: dashboardLinks,
    isAdmin: isAdmin,
  };

  useEffect(() => {
    if (loading && !authTokens) {
      updateToken();
    }
    const fourMinutes = 1000 * 60 * 4;

    const interval = setInterval(async () => {
      if (authTokens) {
        await updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [authTokens, loading]);

  useEffect(() => {
    if (!authenticated && navOpen) {
      setNavOpen(false);
    }
  }, [authenticated, navOpen, setNavOpen]);

  return (
    <AuthContext.Provider value={context_data}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};
