import {
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';

import { AuthLayout } from 'hocs/AuthLayout';
import { RoleAccess } from 'hocs/RoleAccess';

import Create from 'pages/Create/Create';
import Dashboard from 'pages/Dashboard/Dashboard';
import Edit from 'pages/Edit/Edit';
import Forbid from 'pages/Forbid/Forbid';
import Lesson from 'pages/Lesson/Lesson';
import RevertContent from './pages/SuggestedContent/RevertContent';
import LessonEnd from './pages/Lesson/LessonEnd';
import Login from 'pages/Login/Login';
import NotFound from 'pages/NotFound/NotFound';
import Profile from 'pages/Profile/Profile';
import Query from 'pages/Query/Query';
import ProtectedLayout from 'hocs/ProtectedLayout';
import Register from 'pages/Register/Register';
import FrequentlyAskedQuestions from 'pages/Faq/FrequentlyAskedQuestions';
import SuggestContent from 'pages/SuggestedContent/SuggestContent';
import VersionHistory from './pages/ContentHistory/VersionHistory';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route element={<ProtectedLayout />}>
        <Route index path='/' element={<Dashboard />} />
        <Route
          path='/lessons/:lessonNumber/:pageNumber/:isNotif?/:lessonID/:isInsight?'
          element={<Lesson />}
        />
        <Route path='/lessons/:lessonNumber/end' element={<LessonEnd />} />
        <Route element={<RoleAccess roles={['teacher']} />}>
          <Route path='/create' element={<Create />} />
          <Route
            path='/suggest/:lessonNumber/:pageNumber/:lessonID'
            element={<SuggestContent />}
          />
          <Route
            path='/lessons/:lessonNumber/:pageNumber/:lessonID/rvContent'
            element={<RevertContent />}
          />
          <Route
            path='/lessons/history/:lessonID'
            element={<VersionHistory />}
          />
          <Route path='suggestcontent' element={<SuggestContent />} />
          <Route path='/lessons/:lessonNumber/edit' element={<Edit />} />
          <Route path='/queries' element={<Query />} />
          <Route path='/faq' element={<FrequentlyAskedQuestions />} />
        </Route>
        <Route path='/profile' element={<Profile />} />
      </Route>
      <Route path='/403' element={<Forbid />} />
      <Route path='404' element={<NotFound />} />
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);
