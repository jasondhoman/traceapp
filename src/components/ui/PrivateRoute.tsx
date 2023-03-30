import React, { useContext } from 'react';

import { Navigate } from 'react-router-dom';
import { AuthContextType } from '../../@types/authcontext';
import { AuthContext } from '../../context/AuthContext';

//commmentntntntns
interface IPrivateRoute {
  component: any;
  name?: string;
}

const PrivateRoute: React.FC<IPrivateRoute> = ({
  component: RouteComponent,
  name,
}) => {
  const { authenticated } = useContext(AuthContext) as AuthContextType;

  return authenticated ? (
    <RouteComponent name={name} />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
