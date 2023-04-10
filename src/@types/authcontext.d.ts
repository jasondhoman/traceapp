// @types.authcontext.ts
import { Dispatch, SetStateAction, SyntheticEvent } from 'react';
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

export interface LinkStack {
  menu: ILink[];
  report: ILink[];
  admin: ILink[];
  archive: ILink[];
  dashboard: ILink[];
}
export type AuthContextType = {
  user: JWTDecoded | null;
  setUser: Dispatch<SetStateAction<JWTDecoded | null>>;
  authTokens: authTokens;
  loginUser: (e: SyntheticEvent) => Promise<void | MessageResponse>;
  logoutUser: () => void;
  status: string;
  statusLevel: 'error' | 'success' | 'info' | 'warning';
  authenticated: boolean;
  links: LinkStack;
  isAdmin: boolean;
};
