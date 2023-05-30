import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './EndBottomControls.css';



export const EndBottomControls = () => {
	
	const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate(`/`)
    }

    return (
		<div className="end-bottom-nav">
			<Button
				onClick={handleBackToDashboard}
				size="large"
				className="end-bottom-nav-buttons"
				endIcon={<DoneIcon />}
			>
				Finish
			</Button>
		</div>
	);
}

