import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';

import { QueriesService } from 'apis/QueriesService';
import QueryDetailsDialog from './QueryDetailsDialog';

import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Columns for DataGrid
const columns = [
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 170,
    headerClassName: 'super-app-theme--header'
  },
  {
    field: 'lessonInfo',
    headerName: 'Lesson',
    width: 230,
    headerClassName: 'super-app-theme--header'
  },
  {
    field: 'fullName',
    headerName: 'Name',
    width: 210,
    headerClassName: 'super-app-theme--header'
  },
  {
    field: 'preview',
    headerName: 'Preview',
    width: 500,
    headerClassName: 'super-app-theme--header'
  }
];

const QueriesTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [queries, setQueries] = useState([]);

  // Close dialog and navigate back
  const handleClose = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  // Handle row click
  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setIsDialogOpen(true);
  };

  // Close the dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // Fetch queries on mount
  useEffect(() => {
    getQueries();
  }, []);

  // Fetch and format query data
  const getQueries = async () => {
    try {
      const queryResponse = await QueriesService.list();
      // console.log('response', queryResponse.data);

      if (queryResponse) {
        const formattedQueries = queryResponse.data.map((query) => {
          const createdAt = query.subqueries[0]
            ? new Date(query.subqueries[0].created_at)
            : null;
          const formattedDate = createdAt
            ? format(createdAt, 'MM/dd/yyyy HH:mm:ss')
            : null;

          return {
            id: query.id,
            lessonNumber: query.lesson.lessonNumber,
            lessonInfo: `${query.lesson.lessonNumber} - ${query.lesson.title}`,
            title: query.lesson.title,
            year: query.user.year,
            course: query.user.course,
            fullName: `${query.user.first_name} ${query.user.last_name}`,
            preview: query.subqueries[0]?.question || 'No question available',
            createdAt: formattedDate
          };
        });

        // Sort queries by createdAt in descending order
        formattedQueries.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setQueries(formattedQueries);
      }
    } catch (error) {
      console.error('Failed to fetch queries:', error);
    }
  };

  return (
    <Container component='main'>
      <Box mt={4}>
        <Stack divider={<Divider flexItem />} spacing={2}>
          <Box display='flex' justifyContent='space-between'>
            <Breadcrumbs aria-label='breadcrumb'>
              <Link
                underline='hover'
                color={location.pathname === '/faq' ? '#1b5e20' : 'inherit'}
                href='/faq'>
                Frequently Asked
              </Link>
              <Link
                underline='hover'
                color={location.pathname === '/queries' ? '#1b5e20' : 'inherit'}
                href='/queries'>
                Student Queries
              </Link>
            </Breadcrumbs>
            <Button onClick={handleClose} endIcon={<CloseIcon />}>
              Dashboard
            </Button>
          </Box>
          <Box
            mt={4}
            sx={{
              '& .super-app-theme--header': {
                backgroundColor: 'rgba(27, 94, 32, 0.2)'
              }
            }}>
            <DataGrid
              rows={queries}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 }
                },
                sorting: {
                  sortingModel: [
                    {
                      field: 'createdAt',
                      sort: 'desc'
                    }
                  ]
                }
              }}
              pageSizeOptions={[5, 10]}
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
