import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const LessonEnd = () => {
  const navigate = useNavigate()

  const handleBacktoDashboard = () => {
    navigate('/')
  }
  
  return (
    <>
      <h1>LessonEnd</h1>
      <Button onClick={handleBacktoDashboard}>
        Dashboard
      </Button>
    </>
  )
}

export default LessonEnd