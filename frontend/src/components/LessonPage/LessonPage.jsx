import { useState, useEffect } from 'react'
import { Container } from '@mui/material'
import { BottomControls } from './BottomControls'
import { useParams } from 'react-router-dom'
import { getLesson } from '../../apis/Lessons'
import './LessonPage.css'

export const LessonPage = () => {

  const [lesson, setLesson] = useState({})
  const [page, setPage] = useState([])
  const { lessonid , pageid } = useParams()


  useEffect(() => {
    (async () => {
      const lessonData = await getLesson(lessonid)
      console.log('lessonData', lessonData)
      setLesson(lessonData.lesson)
      setPage(lessonData.contents)
      console.log(page)
    })()
  }, [pageid])


  return (
    <div>
      <Container maxWidth='md' className='mb-6rem'>
        <div className='lesson-page-container'>
          <div className='lesson-page-title'>
            <h1>Lesson {lessonid}</h1>
            <div className="vertical-line"></div>
            <h2>{lesson.subtitle}</h2>
          </div>
          <div className='lesson-page-content'>
            <p>{page.contents}</p>
          </div>
        </div>
      </Container>
      <BottomControls />
    </div>
  )
}
