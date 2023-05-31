import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { BottomControls } from './BottomControls';
import { useParams } from 'react-router-dom';
import { getLesson } from '../../apis/Lessons';
import './LessonPage.css';

export const LessonPage = () => {
	const [lesson, setLesson] = useState({
		lesson: {
			id: null,
			title: null,
			subtitle: null,
			url: null,
		},
		contents: [
			{
				id: null,
				contents: null,
				files: null,
			},
		],
	});

	const [pageCounter, setPageCounter] = useState(1);
	const { lessonid, pageid } = useParams();

	const incrementPageCounter = () => {
		setPageCounter((prev) => prev + 1);
	};

	const decrementPageCounter = () => {
		setPageCounter((prev) => prev - 1);
	};

	const fetchLesson = async () => {
		const lessonData = await getLesson(lessonid);
		setLesson(window.structuredClone(lessonData));
	};

	useEffect(() => {
		fetchLesson();
	}, [lessonid]);

	return (
		<>
			<div>
				<Container maxWidth="md" className="mb-6rem">
					<div className="lesson-page-container">
						{pageCounter === 1 && (
							<div className="lesson-page-title">
								<h1>Lesson {lessonid}</h1>
								<div className="vertical-line"></div>
								<h2>{lesson.lesson.subtitle}</h2>
							</div>
						)}

						<div className="lesson-page-content">
							<p>{lesson.contents[pageCounter - 1].contents}</p>
						</div>
					</div>
				</Container>
			</div>

			<BottomControls
				incrementPageCounter={incrementPageCounter}
				decrementPageCounter={decrementPageCounter}
				lessonId={lesson.lesson.id}
				pageCounter={pageCounter}
				numberOfPages={lesson.contents.length}
			/>
		</>
	);
};
