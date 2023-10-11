import {
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';

import { AuthLayout } from 'hocs/AuthLayout';
import { RoleAccess } from 'hocs/RoleAccess';

import Dashboard from 'pages/Dashboard/Dashboard';
import Edit from 'pages/Edit/Edit';
import Forbid from 'pages/Forbid/Forbid';
import Lesson from 'pages/Lesson/Lesson';
import LessonEnd from './pages/Lesson/LessonEnd';
import Login from 'pages/Login/Login';
import NotFound from 'pages/NotFound/NotFound';
import ProtectedLayout from 'hocs/ProtectedLayout';
import Register from 'pages/Register/Register';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route element={<ProtectedLayout />}>
        <Route index path='/' element={<Dashboard />} />
        <Route path='/lessons/:lessonid/:pageNumber' element={<Lesson />} />
        <Route path='/lessons/:lessonid/end' element={<LessonEnd />} />
        <Route element={<RoleAccess roles={['teacher']} />}>
          <Route path='/lessons/:lessonid/edit' element={<Edit />} />
        </Route>
      </Route>
      <Route path='/forbid' element={<Forbid />} />
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);
