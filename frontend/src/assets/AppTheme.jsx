import { createTheme, responsiveFontSizes } from '@mui/material';

const AppTheme = createTheme({
  // TODO: Add theme options here
  typography: {
    fontFamily: ['Poppins', 'Century Gothic', 'sans-serif'].join(',')
  }
});

export default responsiveFontSizes(AppTheme);
