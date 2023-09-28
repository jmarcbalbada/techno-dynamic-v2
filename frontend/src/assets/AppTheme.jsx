import { createTheme, responsiveFontSizes } from '@mui/material';

const AppTheme = createTheme({
  // TODO: Add theme options here
  palette: {
    background: {
      default: '#f5f5f5'
    }    
  },
  typography: {
    fontFamily: ['Poppins', 'Century Gothic', 'sans-serif'].join(',')
  }
});

export default responsiveFontSizes(AppTheme);
