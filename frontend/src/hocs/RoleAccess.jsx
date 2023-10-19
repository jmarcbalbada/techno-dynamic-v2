import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from 'hooks/useAuth';

export const RoleAccess = ({ roles = [] }) => {
  const { user } = useAuth();
  const userRole = user?.role;

  return !roles.length || roles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to='/forbid' replace />
  );
};
