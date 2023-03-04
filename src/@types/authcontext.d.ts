// @types.authcontext.ts
import { ILink, MessageResponse } from './tracetypes';
export interface authTokens {
  access: string;
  refresh: string;
}

export interface JWTDecoded {
  username: string;
  firstname: string;
  lastname: string;
  id: 2;
  iat: number;
  exp: number;
  role: number;
  is_active: boolean;
  reset_password: boolean;
}

export interface settings {
  settings: string;
}
export type AuthContextType = {
  user: JWTDecoded | null;
  setUser: React.Dispatch<React.SetStateAction<JWTDecoded | null>>;
  authTokens: authTokens;
  loginUser: (e: React.SyntheticEvent) => Promise<void | MessageResponse>;
  logoutUser: () => void;
  status: string;
  statusLevel: 'error' | 'success' | 'info' | 'warning';
  authenticated: boolean;
  links: ILink[];
  reportLinks: ILink[];
  adminLinks: ILink[];
  dashboardLinks: ILink[];
  isAdmin: boolean;
};
