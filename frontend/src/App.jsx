import {
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';
import { AuthLayout } from 'hocs/AuthLayout';
import { RoleAccess } from 'hocs/RoleAccess';
import Login from 'pages/Login/Login';
import Register from 'pages/Register/Register';
import ProtectedLayout from 'hocs/ProtectedLayout';
import Dashboard from 'pages/Dashboard/Dashboard';
import Edit from 'pages/Edit/Edit';
import Forbid from 'pages/Forbid/Forbid';
import NotFound from 'pages/NotFound/NotFound';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route element={<ProtectedLayout />}>
        <Route index path='/' element={<Dashboard />} />
        <Route element={<RoleAccess roles={['teacher']} />}>
          <Route path='/edit' element={<Edit />} />
        </Route>
      </Route>
      <Route path='/forbid' element={<Forbid />} />
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);
