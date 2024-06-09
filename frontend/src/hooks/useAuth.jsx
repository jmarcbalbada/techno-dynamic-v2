import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useLocalStorage } from './useLocalStorage';
import { UsersService } from 'apis/UsersService';
import { TeacherService } from '../apis/TeacherService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage('token', null);
  const [user, setUser] = useLocalStorage('user', null);
  const [threshold, setThreshold] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [notificationId, setNotificationId] = useState(null);
  const navigate = useNavigate();

  const login = async (data) => {
    let response, suggestion_return, threshold_return;
    try {
      data = {
        username: data.username,
        password: data.password
      }
      response = await UsersService.login(data);
      suggestion_return = await TeacherService.getTeacherSuggestion();
      threshold_return = await TeacherService.getTeacherThreshold();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response.status);
      }
    }
    setToken(response.data.token);
    setThreshold(threshold_return.data.similarity_threshold);
    setSuggestion(suggestion_return.data.teacher_allow_suggestion);

    if (response.data.student_data) {
      setUser({
        ...response.data.user,
        student_data: response.data.student_data
      });
    } else {
      setUser(response.data.user);
    }
    navigate('/', { replace: true });
  };

  const logout = (returnEarly = false) => {
    setToken(null);
    setUser(null);
    if (returnEarly) return;
    navigate('/login', { replace: true });
  };

  const value = useMemo(() => ({
    threshold,
    suggestion,
    token,
    user,
    login,
    logout,
    notificationId,
    setNotificationId
  }), [token, user, threshold, suggestion, notificationId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
