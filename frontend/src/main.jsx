import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from './App.jsx';
import AppTheme from './assets/AppTheme.jsx';
import './index.css';

import { configureAxios } from './configureAxios.js';

import { CssBaseline, ThemeProvider } from '@mui/material';

configureAxios();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
