import React from 'react';
import LoginRegisterLayout from 'components/common/LoginRegister/LoginRegisterLayout';
import useTitle from 'hooks/useTitle';

const Register = () => {
  useTitle('Register');

  return <LoginRegisterLayout form='register' title='Register' />;
};

export default Register;
