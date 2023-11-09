import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

import { QueriesService } from 'apis/QueriesService';
import QueryDetailsDialog from './QueryDetailsDialog';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';

const columns = [
  { field: 'createdAt', headerName: 'Created At', width: 110 },
  { field: 'lessonInfo', headerName: 'Lesson', width: 210 },
  { field: 'fullName', headerName: 'Name', width: 210 },
  { field: 'courseYear', headerName: 'Course & Year', width: 240 },
  { field: 'preview', headerName: 'Preview', width: 320 }
];

const QueriesTable = () => {
  const navigate = useNavigate();

  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [queries, setQueries] = useState([]);

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

  useEffect(() => {
    getQueries();
  }, []);

  const getQueries = async () => {
  try {
    const queryResponse = await QueriesService.list();
    if (queryResponse) {
      // Transform the response data into rows for the DataGrid
      const formattedQueries = queryResponse.data.map((query) => ({
        id: query.id,
        lessonId: query.lesson.id,
        lessonNumber: query.lesson.lessonNumber,
        title: query.lesson.title,
        firstName: query.user.first_name,
        lastName: query.user.last_name,
        preview: query.subqueries.question,
        course: query.user.course,
        year: query.user.year,
        lessonInfo: `${query.lesson.lessonNumber} - ${query.lesson.title}`,
        fullName: `${query.user.first_name} ${query.user.last_name}`,
        courseYear:
          query.user.course && query.user.year
            ? `${query.user.year} - ${query.user.course}`
            : 'Teacher',
        preview: query.subqueries[0]
          ? query.subqueries[0].question
          : 'No question available',
        createdAt: query.subqueries[0] ? query.subqueries[0].created_at : null
      }));

      formattedQueries.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });

      setQueries(formattedQueries);
    }
  } catch (error) {
    console.log(error);
  }
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
              rows={queries}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 8 }
                }
              }}
              pageSizeOptions={[5, 6, 7, 8, 9, 10]}
              onRowClick={handleRowClick}
              singleRowSelection
              sortModel={[
                {
                  field: 'createdAt',
                  sort: 'desc', 
                }
              ]}
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
