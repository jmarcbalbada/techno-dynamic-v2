import React from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Copyright = (props) => {
  return (
    <Typography variant='body2' align='center' {...props}>
      {'Copyright © '}
      <Link color='inherit' href='#'>
        TechnoDynamic
      </Link>
      {` `} {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Copyright;
