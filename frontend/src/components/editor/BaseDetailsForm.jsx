import React, { useState, useEffect, memo } from 'react';

import FieldPaper from 'components/fieldpaper/FieldPaper';

import { Box, Divider, Stack, TextField, Typography } from '@mui/material';

const BaseDetailsForm = memo(({ formikBase }) => {
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Basic Details
      </Typography>
      <Stack divider={<Divider flexItem />} spacing={2}>
        <Box>
          <FieldPaper>
            <TextField
              fullWidth
              autoFocus
              autoComplete='off'
              required
              id='lessonNumber'
              name='lessonNumber'
              label='Lesson Number'
              type='number'
              value={formikBase.values.lessonNumber}
              onChange={formikBase.handleChange}
              error={
                formikBase.touched.lessonNumber &&
                Boolean(formikBase.errors.lessonNumber)
              }
            />
          </FieldPaper>
        </Box>
        <Box>
          <FieldPaper>
            <TextField
              fullWidth
              autoComplete='off'
              required
              id='title'
              name='title'
              label='Title'
              value={formikBase.values.title}
              onChange={formikBase.handleChange}
              error={
                formikBase.touched.title && Boolean(formikBase.errors.title)
              }
            />
          </FieldPaper>
        </Box>
        <Box>
          <FieldPaper>
            <TextField
              fullWidth
              autoComplete='off'
              required
              multiline
              minRows={2}
              maxRows={5}
              id='subtitle'
              name='subtitle'
              label='Subtitle/Description'
              value={formikBase.values.subtitle}
              onChange={formikBase.handleChange}
              error={
                formikBase.touched.subtitle &&
                Boolean(formikBase.errors.subtitle)
              }
            />
          </FieldPaper>
        </Box>
      </Stack>
    </Box>
  );
});

export default BaseDetailsForm;
