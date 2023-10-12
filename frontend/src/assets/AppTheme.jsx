import { createTheme, responsiveFontSizes } from '@mui/material';

const AppTheme = createTheme({
  // TODO: Add theme options here
  palette: {
    white: {
      main: '#fff',
      contrastText: '#000'
    },
    background: {
      default: '#f0f2f5'
    }
  },
  typography: {
    fontFamily: ['Poppins', 'Century Gothic', 'sans-serif'].join(',')
  }
});

export default responsiveFontSizes(AppTheme);
