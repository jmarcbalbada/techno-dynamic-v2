import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import Appbar from 'layout/Appbar';

import Box from '@mui/material/Box';

export const ProtectedLayout = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to='/login' />;
  }

  return (
    <Box>
      <Appbar />
      <Outlet />
    </Box>
  );
};

export default ProtectedLayout;
