import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import { UsersService } from 'apis/UsersService';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
    setUser(response.data.token);
    navigate('/', { replace: true });
  };

  const logout = () => {
    setUser(null);
    navigate('/', { replace: true });
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
