import { Routes, Route } from 'react-router';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LessonPage } from './components/LessonPage/LessonPage';
import { EditorPage } from './components/EditorPage/EditorPage';
import { NotFound } from './components/NotFound/NotFound';
import { EndLessonPage } from './components/EndLessonPage/EndLessonPage';
import './App.css';

const App = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Dashboard />}></Route>

				<Route
					path="lessons/:lessonid/pages/:pageid"
					element={<LessonPage />}
				></Route>

				<Route path="lessons/:lessonid/end" element={<EndLessonPage />}></Route>

				<Route path="editor" element={<EditorPage />}></Route>

				<Route path="*" element={<NotFound />}></Route>
			</Routes>
		</>
	);
};

export default App;
