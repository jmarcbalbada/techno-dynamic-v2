import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { BottomControls } from './BottomControls';
import { useParams } from 'react-router-dom';
import { getLesson } from '../../apis/Lessons';
import './LessonPage.css';

export const LessonPage = () => {
	const [lesson, setLesson] = useState({});
	const [page, setPage] = useState([]);
	const [pageCounter, setPageCounter] = useState(1);
	const { lessonid, pageid } = useParams();

	const incrementPageCounter = () => {
		setPageCounter((prev) => prev + 1);
	};

	const decrementPageCounter = () => {
		setPageCounter((prev) => prev - 1);
	};

	useEffect(() => {
		(async () => {
			const lessonData = await getLesson(lessonid);
			console.log('lessonData', lessonData);
			setLesson(lessonData.lesson);
			setPage(lessonData.contents);
			console.log(page);
		})();
	}, [pageid]);

	return (
		<>
			{pageCounter === 1 && (
				<div>
					<Container maxWidth="md" className="mb-6rem">
						<div className="lesson-page-container">
							<div className="lesson-page-title">
								<h1>Lessonssssssss {lessonid}</h1>
								<div className="vertical-line"></div>
								<h2>{lesson.subtitle}</h2>
							</div>
							<div className="lesson-page-content">
								<p>{page[0]?.contents}</p>
							</div>
						</div>
					</Container>
				</div>
			)}

			{pageCounter > 1 && (
				<div>
					<Container maxWidth="md" className="mb-6rem">
						<div className="lesson-page-container">
							<div className="lesson-page-content">
								<p>{page[pageCounter - 1]?.contents}</p>
							</div>
						</div>
					</Container>
				</div>
			)}

			<BottomControls
				incrementPageCounter={incrementPageCounter}
				decrementPageCounter={decrementPageCounter}
				lessonId={lesson.id}
				pageCounter={pageCounter}
				numberOfPages={page.length}
			/>
		</>
	);
};
