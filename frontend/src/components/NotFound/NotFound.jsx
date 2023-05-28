import React from 'react'
import Container from '@mui/material/Container'
import { Button, Paper } from '@mui/material'

export const NotFound = () => {
  return (
    <Container
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',

    }}>
      <Paper sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '2rem',
        height: '80%',
        width: '80%',
      }} elevation={24}>
        <h1 className='not-found-label'>
          404 Not Found
        </h1>
        <Button>
          <a href='/' style={{
            textDecoration: 'none',
            color: 'inherit',
          }}>
            Take me back
          </a>
        </Button>
      </Paper>
    </Container>
  )
}
