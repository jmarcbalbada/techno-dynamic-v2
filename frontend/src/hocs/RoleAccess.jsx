import { useAuth } from 'hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

export const RoleAccess = ({ roles = [] }) => {
  const { user } = useAuth();
  const userRole = user?.role;

  return !roles.length || roles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to='/forbid' replace />
  );
};
