import {
  useLoaderData, // TODO: implement useLoaderData with Suspense
  Outlet
} from 'react-router-dom';

import { AuthProvider } from 'hooks/useAuth';

export const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};
