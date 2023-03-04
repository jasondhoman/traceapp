import React, { useContext } from 'react';

import { Navigate } from 'react-router-dom';
import { AuthContextType } from '../../@types/authcontext';
import { AuthContext } from '../../context/AuthContext';

//commmentntntntns
interface IPrivateRoute {
  children: React.ReactNode;
}

const PrivateComponent: React.FC<IPrivateRoute> = ({ children }) => {
  const { user } = useContext(AuthContext) as AuthContextType;

  return user ? <>{children} </> : <Navigate to="/login" />;
};

export default PrivateComponent;
