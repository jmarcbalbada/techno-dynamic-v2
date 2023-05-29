import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

export const EndLessonPage = () => {

    // function to navigate to dashboard using useNavigate
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate(`/`)
    }


  return (
    <div>
        EndLessonPage
        <Button onClick={handleBackToDashboard}>
            FINISH
        </Button>
    </div>
  )
}
