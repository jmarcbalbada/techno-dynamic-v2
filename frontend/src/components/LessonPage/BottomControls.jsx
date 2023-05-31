import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getLesson } from '../../apis/Lessons';
import { useState } from 'react';
import './BottomControls.css';

export const BottomControls = ({
	lessonId,
	pageCounter,
	numberOfPages,
	decrementPageCounter,
	incrementPageCounter,
}) => {
	const navigate = useNavigate();

	const handleBackButton = () => {
		if (pageCounter > 1) {
			decrementPageCounter();
			getLesson(lessonId).then((res) => {
				console.log('res', res);
				navigate(`/lessons/${lessonId}/pages/${pageCounter - 1}`);
			});
		}
    else {
      navigate(`/`);
    }
	};

	const handleNextButton = () => {
		if (pageCounter < numberOfPages) {
			incrementPageCounter();

			getLesson(lessonId).then((res) => {
				console.log('res', res);
				navigate(`/lessons/${lessonId}/pages/${pageCounter + 1}`);
			});
		}
    else {
      navigate(`/lessons/${lessonId}/end`);      
    }
	};

	return (
		<div className="bottom-nav">
			<Button
				onClick={handleBackButton}
				size="large"
				className="bottom-nav-buttons"
				startIcon={<ArrowBackIcon />}
			>
				Back
			</Button>
			<Button
				onClick={handleNextButton}
				size="large"
				className="bottom-nav-buttons"
				endIcon={<ArrowForwardIcon />}
			>
				Next
			</Button>
		</div>
	);
};
