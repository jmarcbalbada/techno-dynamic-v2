import {
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';
import { AuthLayout } from 'components/common/Layout/AuthLayout/AuthLayout';
import Login from 'pages/Login/Login';
import Register from 'pages/Register/Register';
import ProtectedLayout from 'components/common/Layout/ProtectedLayout/ProtectedLayout';
import Dashboard from 'pages/Dashboard/Dashboard';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route element={<ProtectedLayout />}>
        <Route index path='/' element={<Dashboard />} />
      </Route>
    </Route>
  )
);
