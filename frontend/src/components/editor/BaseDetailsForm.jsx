import React, { useState, memo } from 'react';

import FieldPaper from 'components/fieldpaper/FieldPaper';

import {
  styled,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import ImageIcon from '@mui/icons-material/Image';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const BaseDetailsForm = memo(({ formikBase }) => {
  const [displayText, setDisplayText] = useState(
    getDisplayText(formikBase.values.coverImage)
  );

  function getDisplayText(coverImageValue) {
    if (coverImageValue && typeof coverImageValue === 'string') {
      let filename = coverImageValue.split('/').pop();
      if (filename === 'null') {
        return 'No image uploaded';
      }
      return filename;
    }
    return 'No image uploaded';
  }

  const handleFileChange = (event) => {
    const uploadedFile = event.currentTarget.files[0];

    formikBase.setFieldValue('coverImage', uploadedFile);
    setDisplayText(getDisplayText(uploadedFile.name));
  };

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
        <Box>
          <FieldPaper>
            <Typography variant='body1' gutterBottom>
              Cover Image
            </Typography>
            <Box my={1}>
              <Box display='flex' alignItems='center' gap={1}>
                <ImageIcon />
                <Typography variant='body2'>{displayText}</Typography>
              </Box>
            </Box>
            <Button component='label' size='small' variant='contained'>
              Upload Cover Image
              <VisuallyHiddenInput
                type='file'
                accept='image/*'
                name='coverImage'
                onChange={handleFileChange}
              />
            </Button>
          </FieldPaper>
        </Box>
      </Stack>
    </Box>
  );
});

export default BaseDetailsForm;
