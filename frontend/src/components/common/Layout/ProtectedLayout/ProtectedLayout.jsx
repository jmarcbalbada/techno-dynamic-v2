import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import Appbar from '../Appbar/Appbar';

import Box from '@mui/material/Box';

export const ProtectedLayout = () => {
  const { user } = useAuth();

  if (!user) {
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
