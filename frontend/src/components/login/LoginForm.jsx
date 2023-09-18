import React from 'react';
import { useFormik } from 'formik';
import { LoginValidationSchema } from './LoginValidationSchema';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: LoginValidationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  return (
    <Box component='form' onSubmit={formik.handleSubmit} mt={4}>
      <TextField
        margin='normal'
        fullWidth
        autoFocus
        autoComplete='off'
        id='username'
        name='username'
        label='Username'
        value={formik.values.username}
        onChange={formik.handleChange}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <PersonIcon />
            </InputAdornment>
          )
        }}
      />
      <TextField
        margin='normal'
        fullWidth
        autoComplete='off'
        id='password'
        name='password'
        label='Password'
        type='password'
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <LockIcon />
            </InputAdornment>
          )
        }}
      />
      <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
        Login
      </Button>
      {/* Linear Progress here */}
      <Divider sx={{ my: 2 }}>or</Divider>
      <Typography align='center' mb={5}>
        Don't have an account?{' '}
        <Link component={RouterLink} to='/register' underline='hover'>
          Register
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
