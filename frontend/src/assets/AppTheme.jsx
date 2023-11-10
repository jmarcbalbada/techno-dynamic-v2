import { createTheme } from '@mui/material';
import { responsiveFontSizes } from '@mui/material';

const AppTheme = createTheme({
  // TODO: Add theme options here
  palette: {
    primary: {
      main: '#1b5e20'
    },
    secondary: {
      main: '#cfd8dc'
    },
    white: {
      main: '#fff',
      contrastText: '#000'
    },
    background: {
      default: '#f9fafb'
    },
    textfield: {
      main: '#204045'
    },
  },
  typography: {
    fontFamily: ['Poppins', 'Century Gothic', 'sans-serif'].join(',')
  }
});

export default responsiveFontSizes(AppTheme);
