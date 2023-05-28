import React from 'react'
import Container from '@mui/material/Container'
import TechnoLogo from '../../assets/TechnoLogo.png'
import Lion from '../../assets/LionLogo.png'
import './Dashboard.css'

export const Dashboard = () => {
  return (
    <div className='dashboard-container'>
      <div className='temp-nav'>
        <a href='/'>My Name</a>
        <div className='vertical-line'></div>
        <a href='/'>Logout</a>
      </div>
      <div className='dashboard-hero'>
        <div className='dashboard-hero-lion'>
          <img src={Lion} alt='Lion Logo' />
        </div>
        <div className='dashboard-hero-text'>
          <img src={TechnoLogo} alt='Techno Logo' />
          <div className='instructional'>
            Instructional Resources
          </div>
        </div>
      </div>

      <hr className='dashboard-hr' />

      <Container maxWidth="xl">
        <div className='dashboard-overview'>
          <p>This course is designed to introduce students to the principles and practices of Technopreneurship, which involves the process of identifying and pursuing opportunities to create innovative products or services using technology. The course will cover topics such as idea generation, market research, funding, team building, and product development, among others. Students will also have the opportunity to develop and present their own business plans.</p>
          <strong>Course Objectives</strong>
          <ol>
            <li>
              Understand principles of technopreneurship and evaluate opportunities.
            </li>
            <li>
              Develop and present a comprehensive business plan.
            </li>
            <li>
              Think critically and creatively to solve challenges in the technology sector.
            </li>
          </ol>
        </div>
      </Container>
    </div>
  )
}
