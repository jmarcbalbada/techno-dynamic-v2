import React, { useState, memo } from 'react';

import FieldPaper from 'components/fieldpaper/FieldPaper';

import { styled, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

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

const BaseDetailsForm = memo(
  ({ formikBase, files, handleUploadFiles, handleDeleteFile }) => {
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

    function getFileName(file) {
      if (file && typeof file === 'string') {
        let filename = file.split('/').pop();
        if (filename === 'null') {
          return '';
        }
        return filename;
      }
      return '';
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
                  <ImageIcon color='primary' />
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
          <Box>
            <FieldPaper>
              <Typography variant='body1' gutterBottom>
                Files
              </Typography>
              <Box my={1}>
                {files.map((file, index) => (
                  <Chip
                    target='_blank'
                    key={index}
                    label={getFileName(file.file) || (file.file?.name && getFileName(file.file.name))}

                    onDelete={() => handleDeleteFile(file)}
                    icon={
                      <PictureAsPdfOutlinedIcon
                        color='primary'
                        sx={{ mr: 1 }}
                      />
                    }
                    color='primary'
                    variant='outlined'
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
              <Button component='label' size='small' variant='contained'>
                Upload Files
                <VisuallyHiddenInput
                  type='file'
                  accept='application/pdf'
                  multiple
                  name='files'
                  onChange={(event) => handleUploadFiles(event)}
                />
              </Button>
            </FieldPaper>
          </Box>
        </Stack>
      </Box>
    );
  }
);

export default BaseDetailsForm;
