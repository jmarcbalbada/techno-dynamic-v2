import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

import QueryDetailsDialog from './QueryDetailsDialog';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'lessonNumber', headerName: 'Lesson', width: 130 },
  { field: 'title', headerName: 'Lesson Title', width: 250 },
  { field: 'lastName', headerName: 'Last Name', width: 180 },
  { field: 'question', headerName: 'Questions', width: 300 }
];

const rows = [
  {
    id: 1,
    lessonNumber: 1,
    title: 'Introduction',
    question: 'What is elevator pitch?',
    lastName: 'Smith',
    firstName: 'Waro',
    course: 'BSCS',
    year: 2,
    response:
      'An elevator pitch is a brief and compelling introduction that summarizes a product, service, or idea in a concise and engaging manner.'
  },
  {
    id: 2,
    lessonNumber: 2,
    title: 'Starting a New Venture',
    question: 'What is a venture?',
    lastName: 'Johnson',
    firstName: 'Justine',
    course: 'BSIT',
    year: 3,
    response: 'A venture refers to a new business'
  },
  {
    id: 3,
    lessonNumber: 3,
    title: 'Team Formation',
    question: 'What are the members of a team?',
    lastName: 'Williams',
    firstName: 'Carl',
    course: 'BSCS',
    year: 1,
    response:
      'Team members are individuals with diverse skills and expertise who collaborate to achieve common goals and objectives.'
  },
  {
    id: 4,
    lessonNumber: 4,
    title: 'Market Segmentation',
    question: 'What is a market?',
    lastName: 'Brown',
    firstName: 'James',
    course: 'BSCS',
    year: 4,
    response:
      'A market is a specific group of potential customers or consumers who are interested in a particular product or service and are willing to make a purchase.'
  },
  {
    id: 5,
    lessonNumber: 5,
    title: 'Lean Canvas',
    question: 'What is lean canvas?',
    lastName: 'Davis',
    firstName: 'Noah',
    course: 'BSIT',
    year: 2,
    response:
      'Lean Canvas is a strategic management tool used by entrepreneurs and startups to develop a concise and visual one-page business plan.'
  },
  {
    id: 6,
    lessonNumber: 6,
    title: 'Wild Chase!',
    question: 'What is wild chase?',
    lastName: 'Miller',
    firstName: 'Ava',
    course: 'BSCS',
    year: 3,
    response:
      'Wild Chase refers to a high-energy and competitive pursuit or endeavor to achieve a challenging goal or objective.'
  },
  {
    id: 7,
    lessonNumber: 7,
    title: 'Validation Preparation',
    question: 'What are the preparations needed?',
    lastName: 'Wilson',
    firstName: 'Ethan',
    course: 'BSIT',
    year: 1,
    response:
      'Preparations include conducting market research, validating the product idea, analyzing competitors, and developing a marketing strategy.'
  },
  {
    id: 8,
    lessonNumber: 8,
    title: 'Problem-Solution Validation',
    question: 'What is a good problem?',
    lastName: 'Moore',
    firstName: 'Sophia',
    course: 'BSIT',
    year: 4,
    response:
      'A good problem is a significant and unsolved issue or challenge faced by a specific target audience, which presents a valuable opportunity for a business solution.'
  },
  {
    id: 9,
    lessonNumber: 9,
    title: 'Market Size',
    question: 'What is market size?',
    lastName: 'Anderson',
    firstName: 'Mason',
    course: 'BSCS',
    year: 2,
    response:
      'Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.Market size refers to the total number of potential customers or the total revenue that can be generated in a specific market segment during a defined period of time.'
  }
];

const QueriesTable = () => {
  const navigate = useNavigate();

  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClose = useCallback(() => {
    navigate('/', { replace: true });
  }, []);

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Container component='main'>
      <Box mt={4}>
        <Stack divider={<Divider flexItem />} spacing={2}>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h4'>Student's Queries</Typography>
            <Button onClick={handleClose} endIcon={<CloseIcon />}>
              Dashboard
            </Button>
          </Box>
          <Box mt={4}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 8 }
                }
              }}
              pageSizeOptions={[5, 6, 7, 8, 9, 10]}
              onRowClick={handleRowClick}
              singleRowSelection
            />
          </Box>
        </Stack>
      </Box>
      <QueryDetailsDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        selectedRow={selectedRow}
      />
    </Container>
  );
};

export default QueriesTable;
