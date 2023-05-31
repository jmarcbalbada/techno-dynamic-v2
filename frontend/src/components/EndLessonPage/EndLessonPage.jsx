import { Container, CardMedia } from '@mui/material';
import { EndBottomControls } from './EndBottomControls';
import './EndLessonPage.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getLesson } from '../../apis/Lessons';

export const EndLessonPage = () => {
	const { lessonid } = useParams();
	const [lesson, setLesson] = useState({});

	useEffect(() => {
		(async () => {
			const lessonData = await getLesson(lessonid);
			console.log('lessonData', lessonData);
			setLesson(lessonData);
		})();
	}, []);

	return (
		<>
			<div>
				<Container maxWidth="md" className="mb-6rem">
					<div className="end-lesson-page-container">
						<div className="end-lesson-page-title">
							<h1>Lesson {lessonid}</h1>
							<div className="vertical-line"></div>
							<h2>{lesson.title}</h2>
						</div>
						<CardMedia
							component="img"
							height="400"
							image="https://source.unsplash.com/random/featured/?celebrate"
						/>
						<div className="end-lesson-page-message">
							<h3>Good Job!</h3>
							<p>You've finished the Lesson!</p>
						</div>
					</div>
				</Container>
			</div>

			<EndBottomControls />
		</>
	);
};
