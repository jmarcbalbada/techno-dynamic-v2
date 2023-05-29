import React from 'react'
import { Container } from '@mui/material'
import { BottomControls } from './BottomControls'
import './LessonPage.css'

export const LessonPage = () => {
  return (
    <div>
      <Container maxWidth='md' className='mb-6rem'>
        <div className='lesson-page-container'>
          <div className='lesson-page-title'>
            <h1>Lesson 1</h1>
            <div className="vertical-line"></div>
            <h2>asd</h2>
          </div>
          <div className='lesson-page-content'>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores autem temporibus alias, fuga, voluptate, repudiandae error praesentium in eveniet repellendus maiores eos perspiciatis aspernatur veritatis nobis delectus. Quis, sapiente inventore. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta, corrupti perspiciatis quidem veritatis reprehenderit amet, harum rem optio nesciunt ducimus modi obcaecati facilis reiciendis. Eos velit dolorum ipsa sequi nesciunt!</p>
          </div>
        </div>
      </Container>
      <BottomControls />
    </div>
  )
}
