import { createTheme } from '@mui/material';
import { responsiveFontSizes } from '@mui/material';

const AppTheme = createTheme({
  // TODO: Add theme options here
  palette: {
    primary: {
      main: '#1b5e20'
    },
    secondary: {
      main: '#cfd8dc',
      rusty: '#ffcc00',
    },
    white: {
      main: '#fff',
      contrastText: '#000'
    },
    background: {
      darker: "#cfd0d1",
      default: '#f9fafb',
      neutral: "#4c80d4",
      lighterneutral: "#bfcfe9",
      danger: "#961e1e",
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
