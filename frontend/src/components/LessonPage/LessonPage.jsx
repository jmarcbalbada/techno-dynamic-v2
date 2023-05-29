import { useState, useEffect } from 'react'
import { Container } from '@mui/material'
import { BottomControls } from './BottomControls'
import { useParams } from 'react-router-dom'
import { getLesson } from '../../apis/Lessons'
import './LessonPage.css'

export const LessonPage = () => {

  const [lesson, setLesson] = useState({})
  const { id: idOfLesson } = useParams()

  useEffect(() => {
    getLesson(idOfLesson).then((res) => {
      setLesson(res)
    })
  }, [idOfLesson])


  return (
    <div>
      <Container maxWidth='md' className='mb-6rem'>
        <div className='lesson-page-container'>
          <div className='lesson-page-title'>
            <h1>Lesson {idOfLesson}</h1>
            <div className="vertical-line"></div>
            <h2>asd</h2>
          </div>
          <div className='lesson-page-content'>
            {lesson.contents?.map((content, idx) => {
              return (
                <p>{content.contents}</p>
              )
            })}
          </div>
        </div>
      </Container>
      <BottomControls />
    </div>
  )
}
