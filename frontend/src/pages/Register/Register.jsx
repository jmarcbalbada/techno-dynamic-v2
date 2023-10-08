import React from 'react';
import LoginRegisterLayout from 'components/loginregister/LoginRegisterLayout';
import useTitle from 'hooks/useTitle';

const Register = () => {
  useTitle('Register');

  return <LoginRegisterLayout form='register' title='Register' />;
};

export default Register;
