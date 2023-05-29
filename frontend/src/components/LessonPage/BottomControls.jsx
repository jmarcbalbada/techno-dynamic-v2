import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from '@mui/material';
import './BottomControls.css'

export const BottomControls = () => {
  return (
    <div className='bottom-nav'>
        <Button size='large' className='bottom-nav-buttons' startIcon={<ArrowBackIcon />}>Back</Button>
        <Button size='large' className='bottom-nav-buttons' endIcon={<ArrowForwardIcon />}>Next</Button>
    </div>    
  )
}
