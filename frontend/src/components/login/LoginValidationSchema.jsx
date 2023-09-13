import * as yup from 'yup';

export const LoginValidationSchema = yup.object({
  username: yup
    .string('Enter your email')
    .required('Type in your username'),
  password: yup
    .string('Enter your password')
    .required('Type in your password')
});