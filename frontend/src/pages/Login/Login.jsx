import React from 'react';
import LoginRegisterLayout from 'components/common/LoginRegister/LoginRegisterLayout';
import useTitle from 'hooks/useTitle';

const Login = () => {
  useTitle('Login');

  return <LoginRegisterLayout form='login' title='Login' />;
};

export default Login;
