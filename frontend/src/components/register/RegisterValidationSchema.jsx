import * as yup from 'yup';

export const RegisterValidationSchema = yup.object({
  firstName: yup
    .string('Enter your firstname')
    .required('Firstname is required'),
  lastName: yup
    .string('Enter your lastname')
    .required('Lastname is required'),
  username: yup
    .string('Enter your username')
    .required('Username is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string('Confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  course: yup
    .string().required('Select a course'),
  yearLevel: yup
    .string().required('Select a year level'),
});
