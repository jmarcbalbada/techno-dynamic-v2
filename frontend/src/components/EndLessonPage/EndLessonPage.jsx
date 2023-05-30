import { Container, CardMedia } from '@mui/material'
import { EndBottomControls } from './EndBottomControls';
import './EndLessonPage.css'

export const EndLessonPage = () => {

  return (
    <>
				<div>
					<Container maxWidth="md" className="mb-6rem">
						<div className="end-lesson-page-container">
							<div className="end-lesson-page-title">
								<h1>Lessons</h1>
								<div className="vertical-line"></div>
								<h2>subtitle</h2>
							</div>
              <CardMedia
                    component='img'
                    height='160'
                    image='https://source.unsplash.com/random/featured/?celebration'
                />
							<div className="end-lesson-page-message">
                <h3>Good Job!</h3>
                <p>You've finished the Lesson!</p>
							</div>
						</div>
					</Container>
				</div>

      <EndBottomControls/>
    </>
  );
};
