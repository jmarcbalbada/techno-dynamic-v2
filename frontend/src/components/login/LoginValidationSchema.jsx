import * as yup from 'yup';

export const LoginValidationSchema = yup.object({
  username: yup
    .string('Enter your email')
    .required('Username is required'),
  password: yup
    .string('Enter your password')
    .required('Password is required')
});
