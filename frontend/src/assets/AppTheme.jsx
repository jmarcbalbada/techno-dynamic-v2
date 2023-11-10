import { createTheme } from '@mui/material';
import { responsiveFontSizes } from '@mui/material';

const AppTheme = createTheme({
  // TODO: Add theme options here
  palette: {
    primary: {
      main: '#3362cc'
    },
    secondary: {
      main: '#0174BE'
    },
    white: {
      main: '#fff',
      contrastText: '#000'
    },
    background: {
      default: '#f9fafb'
    }
  },
  typography: {
    fontFamily: ['Poppins', 'Century Gothic', 'sans-serif'].join(',')
  }
});

export default responsiveFontSizes(AppTheme);
