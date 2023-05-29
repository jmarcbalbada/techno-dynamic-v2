import React, { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import { LessonCards } from './LessonCards';
import { CreateLessonCard } from './CreateLessonCard';
import { Button, Grid } from '@mui/material';
import TechnoLogo from '../../assets/TechnoLogo.png';
import Lion from '../../assets/LionLogo.png';
import { getLessons } from '../../apis/Lessons';
import './Dashboard.css';

export const Dashboard = () => {
	const [lessons, setLessons] = useState([]);

	useEffect(() => {
		getLessons().then((res) => {
			setLessons(res);
			console.log('lessons', lessons);
		});
	}, [lessons.subtitle]);

	return (
		<div className="dashboard-container">
			<div className="temp-nav">
				<a href="/">My Name</a>
				<div className="temp-nav-vertical-line"></div>
				<a href="/">Logout</a>
			</div>
			<div className="dashboard-hero">
				<div className="dashboard-hero-lion">
					<img src={Lion} alt="Lion Logo" />
				</div>
				<div className="dashboard-hero-text">
					<img src={TechnoLogo} alt="Techno Logo" />
					<div className="instructional">Instructional Resources</div>
				</div>
			</div>

			<hr className="dashboard-hr" />
			<Container maxWidth="xl" className="mb-2rem">
				<div className="dashboard-overview">
					<p>
						This course is designed to introduce students to the principles and
						practices of Technopreneurship, which involves the process of
						identifying and pursuing opportunities to create innovative products
						or services using technology. The course will cover topics such as
						idea generation, market research, funding, team building, and
						product development, among others. Students will also have the
						opportunity to develop and present their own business plans.
					</p>
					<strong>Course Objectives</strong>
					<ol>
						<li>
							Understand principles of technopreneurship and evaluate
							opportunities.
						</li>
						<li>Develop and present a comprehensive business plan.</li>
						<li>
							Think critically and creatively to solve challenges in the
							technology sector.
						</li>
					</ol>
				</div>
			</Container>

			<Container maxWidth="xl" className="mb-2rem">
				<Grid container spacing={3}>
					<Grid item xs={12} sm={12} md={12} lg={12}>
						<CreateLessonCard />
					</Grid>

					{lessons?.map((lesson, index) => {
						return (
							<Grid key={lesson.id} item sm={12} md={6} lg={4}>
								<LessonCards lesson={lesson} idx={index} />
							</Grid>
						);
					})}
				</Grid>
			</Container>
		</div>
	);
};
