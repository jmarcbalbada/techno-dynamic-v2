import { useEffect, useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	CardActions,
	Button,
	CardActionArea,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getLesson } from '../../apis/Lessons';
import { Link, useNavigate } from 'react-router-dom';
import './LessonCards.css';

export const LessonCards = ({ lesson, idx }) => {
	const navigate = useNavigate();
	let urlCount = 0;

	const handleOpenLesson = () => {
		getLesson(lesson.id).then((res) => {
			console.log('res', res);
			navigate(`/lessons/${lesson.id}/pages/1`);
		});
	};

	return (
		<Box width="100%">
			<Card
				sx={{
					backgroundColor: '#F5F5F5',
					}}>
				<CardActionArea onClick={handleOpenLesson}>
					<CardMedia
						component="img"
						height="140"
						image="https://source.unsplash.com/random/featured/?education"
						alt='education'
					/>
					<CardContent>
						<p className="lesson-card-number">
							Lesson {idx + 1}
						</p>

						<p className="lesson-card-title">
							{lesson.title}
						</p>

						<p className="lesson-card-subtitle">
							{lesson.subtitle}
						</p>

						<hr className="lesson-card-hr" />

						<p className="lesson-card-preview">
						<span>{lesson.pages.length} {lesson.pages.length === 1 ? 'Content' : "Contents"}</span>
							
							{lesson.pages.forEach(element => {
								if(element.url !== null) {
									urlCount++;
								}
							})}

							<span>
							{urlCount} {urlCount === 1 ? 'URL' : "URLs"}
							</span>
						</p>
					</CardContent>
				</CardActionArea>
				<CardActions>
					<Button
						variant="text"
						endIcon={<EditIcon />}
						sx={{ color: '#3F3F3F' }}
					>
						Edit
					</Button>
				</CardActions>
			</Card>
		</Box>
	);
};
