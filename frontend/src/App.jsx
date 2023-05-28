import { Routes, Route } from 'react-router'
import { Dashboard } from './components/Dashboard/Dashboard'
import { LessonPage } from './components/LessonPage/LessonPage'
import { NotFound } from './components/NotFound/NotFound'
import './App.css'

const App = () => {

  return (
    <>
      <Routes>

        <Route path='/' element={<Dashboard />}>
        </Route>

        <Route path='lesson' element={<LessonPage />}>
        </Route>

        <Route path='*' element={<NotFound />}></Route>

      </Routes>
    </>
  )
}

export default App
