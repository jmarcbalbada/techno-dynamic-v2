import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { BottomControls } from './BottomControls';
import { useParams } from 'react-router-dom';
import { getLesson } from '../../apis/Lessons';
import './LessonPage.css';

export const LessonPage = () => {
	const [lesson, setLesson] = useState({
		id: null,
		title: null,
		subtitle: null,
		coverImage: null,
		pages: [
			{
				id: null,
				contents: null,
				url: null,
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
		setLesson(structuredClone(lessonData));
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
								<h2>{lesson.title}</h2>
							</div>
						)}

						<div className="lesson-page-content">
							<p>{lesson.pages[pageCounter - 1].contents}</p>
						</div>
						<div className='lesson-page-urls'>
							<hr />
							<div className='lesson-page-url-label'>
								Url:
							</div>
							{lesson.pages[pageCounter - 1].url && (
								<a href={lesson.pages[pageCounter - 1].url} className='lesson-page-url-link' target='_blank'>
									{lesson.pages[pageCounter - 1].url}
								</a>
							)}
						</div>
					</div>
				</Container>
			</div>

			<BottomControls
				incrementPageCounter={incrementPageCounter}
				decrementPageCounter={decrementPageCounter}
				lessonId={lesson.id}
				pageCounter={pageCounter}
				numberOfPages={lesson.pages.length}
			/>
		</>
	);
};
