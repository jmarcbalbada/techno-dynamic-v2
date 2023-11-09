import React from 'react'

import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import QueriesTable from '../../components/query/QueriesTable';

const Query = () => {
  return (
    <Container component='main'>
      <Box>
        <QueriesTable /> 
      </Box>
    </Container>
  )
}

export default Query;