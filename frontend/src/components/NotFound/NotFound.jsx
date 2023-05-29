import React from 'react'
import Container from '@mui/material/Container'
import { Button, Paper } from '@mui/material'
import './NotFound.css'

export const NotFound = () => {
  return (
    <>
      <div className='FOUR-left'>
        <div>4</div>
        <div id='ZERO'>0</div>
        <div>4</div>
      </div>
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
          width: '70%',
        }} elevation={24}>
          <h1 className='not-found-label'>
            Not Found
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
    </>
  )
}
