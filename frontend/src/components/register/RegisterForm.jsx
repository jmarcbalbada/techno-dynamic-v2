import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { useAuth } from 'hooks/useAuth';
import { courseCategories } from 'data/courseCategories';
import { RegisterValidationSchema } from './RegisterValidationSchema';
import { SnackBarAlert } from 'components/common/SnackbarAlert/SnackbarAlert';
import { UsersService } from 'apis/UsersService';
import { yearCategories } from 'data/yearCategories';

import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { CustomTextField } from '../loginregister/CustomTextField';

const RegisterForm = () => {
  const { login } = useAuth();
  const timer = 3000;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      course: '',
      yearLevel: ''
    },
    validationSchema: RegisterValidationSchema,
    onSubmit: async (values) => {
      // TODO: try to separate fetching logic and axios checking from this component
      setIsRegistering(true);
      setErrorMessage('');
      try {
        const response = await UsersService.register({
          username: values.username,
          password: values.password,
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          course: values.course,
          year: values.yearLevel,
          role: 'student'
        });

        if (response.status === 201) {
          setSnackbarSuccessOpen(true); // Show the snackbar

          // Wait for the snackbar to be displayed before navigating
          setTimeout(() => {
            // After the snackbar is shown, navigate to the desired page
            navigate('/');

            // Log in after navigating
            login({
              username: values.username,
              password: values.password
            });
          }, timer); // 'timer' here refers to the duration you want to delay (e.g., 3000ms)
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const response = error.response;
          if (response && response.status) {
            const errorStatus = response.status;
            switch (errorStatus) {
              case 400:
                if (response.data.username) {
                  formik.setErrors({
                    username: 'Username already exists'
                  });
                } else if (response.data.email) {
                  formik.setErrors({
                    email: 'Email already exists'
                  });
                }
                break;
              default:
                setErrorMessage('Something went wrong');
                break;
            }
          } else {
            setErrorMessage('Something went wrong');
          }
        }
      }
      setIsRegistering(false);
    }
  });

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSnackbarSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarSuccessOpen(false);
  };

  return (
    <Box component='form' onSubmit={formik.handleSubmit} mt={4}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CustomTextField
            fullWidth
            autoFocus
            autoComplete='off'
            id='firstName'
            name='firstName'
            label='First Name'
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextField
            fullWidth
            autoComplete='off'
            id='lastName'
            name='lastName'
            label='Last Name'
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            autoComplete='off'
            id='username'
            name='username'
            label='Username'
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            autoComplete='off'
            id='email'
            name='email'
            label='Email'
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            autoComplete='off'
            id='password'
            name='password'
            label='Password'
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    tabIndex={-1}
                    edge='end'>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            autoComplete='off'
            id='confirmPassword'
            name='confirmPassword'
            label='Confirm Password'
            type={showPassword ? 'text' : 'password'}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    tabIndex={-1}
                    edge='end'>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextField
            select
            fullWidth
            autoComplete='off'
            id='course'
            name='course'
            label='Course'
            value={formik.values.course}
            onChange={formik.handleChange}
            error={formik.touched.course && Boolean(formik.errors.course)}
            helperText={formik.touched.course && formik.errors.course}>
            {courseCategories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextField
            select
            defaultValue='1'
            fullWidth
            autoComplete='off'
            id='yearLevel'
            name='yearLevel'
            label='Year Level'
            value={formik.values.yearLevel}
            onChange={formik.handleChange}
            error={formik.touched.yearLevel && Boolean(formik.errors.yearLevel)}
            helperText={formik.touched.yearLevel && formik.errors.yearLevel}>
            {yearCategories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            type='submit'
            loading={isRegistering}
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}>
            <span>Register</span>
          </LoadingButton>
          <Typography color='error' sx={{ textAlign: 'center' }}>
            {errorMessage}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mb: 2 }}>or</Divider>
        </Grid>
      </Grid>
      <Typography align='center' mb={5}>
        Already have an account?{' '}
        <Link component={RouterLink} to='/login' underline='hover'>
          Login
        </Link>
      </Typography>
      <Snackbar
        open={snackbarSuccessOpen}
        autoHideDuration={timer}
        onClose={handleSnackbarSuccessClose}>
        <SnackBarAlert
          onClose={handleSnackbarSuccessClose}
          severity='success'
          sx={{
            width: '100%'
          }}>
          Account successfully registered! Logging you in...
        </SnackBarAlert>
      </Snackbar>
    </Box>
  );
};

export default RegisterForm;
