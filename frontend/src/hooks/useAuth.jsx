import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import { UsersService } from 'apis/UsersService';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage('token', null);
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();

  const login = async (data) => {
    let response;
    try {
      response = await UsersService.login({
        username: data.username,
        password: data.password
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response.status);
      }
    }
    console.log('response', response);
    setToken(response.data.token);
    setUser(response.data.user);
    navigate('/', { replace: true });
  };

  const logout = (returnEarly = false) => {
    setToken(null);
    setUser(null);
    if (returnEarly) return;
    navigate('/login', { replace: true });
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
