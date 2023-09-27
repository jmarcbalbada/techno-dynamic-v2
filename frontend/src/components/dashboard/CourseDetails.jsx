import { Box, List, ListItem, Typography, styled } from '@mui/material';
import React from 'react';

const introduction = `This course is designed to introduce students to the principles and practices of Technopreneurship, which involves the process of identifying and pursuing opportunities to
create innovative products or services using technology. The course will cover topics such as idea generation, market research, funding, team building, and product
development, among others. Students will also have the opportunity to develop and present their own business plans.`;

const Objectives = [
  'Understand principles of technopreneurship and evaluate opportunities.',
  'Develop and present a comprehensive business plan.',
  'Think critically and creatively to solve challenges in the technology sector'
];

const ObjectivesList = styled(List)(({ theme }) => ({
  listStyleType: 'decimal',
  pl: 2
}));

const ObjectivesListItem = styled(ListItem)(({ theme }) => ({
  display: 'list-item',
  listStylePosition: 'inside',
  '&:last-child': {
    paddingBottom: 0
  }
}));

const CourseDetails = () => {
  return (
    <Box
      borderRadius={3}
      sx={{
        bgcolor: 'lightgrey',
        p: 2
      }}>
      <Typography gutterBottom>{introduction}</Typography>
      <Typography variant='h6'>Course Objectives</Typography>
      <ObjectivesList disablePadding>
        {Objectives.map((objective, index) => (
          <ObjectivesListItem key={index}>{objective}</ObjectivesListItem>
        ))}
      </ObjectivesList>
    </Box>
  );
};

export default CourseDetails;
