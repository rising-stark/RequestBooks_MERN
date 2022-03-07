import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = (props) => {
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return props.auth ? <Outlet /> : props.redirectpath == "login" ? <Navigate to="/login" /> : <Navigate to="/" />;
}

export default PrivateRoute
