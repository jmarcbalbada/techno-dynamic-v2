import * as yup from 'yup';

export const BaseDetailsValidationSchema = yup.object({
  lessonNumber: yup
    .number('Enter a number')
    .required('Lesson number is required'),
  title: yup
    .string('Enter a title')
    .required('Title is required'),
  subtitle: yup
    .string('Enter a subtitle')
    .required('Subtitle is required')
});