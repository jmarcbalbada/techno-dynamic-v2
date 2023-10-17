import * as yup from 'yup';

export const BaseDetailsValidationSchema = yup.object({
  lessonNumber: yup
    .number('Enter a number')
    .min(1, 'Lesson number should be greater than 0')
    .required('Lesson number is required'),
  title: yup
    .string('Enter a title')
    .min(2, 'Title should be of minimum 2 characters length')
    .max(100, 'Title should be of maximum 100 characters length')
    .required('Title is required'),
  subtitle: yup
    .string('Enter a subtitle')
    .min(2, 'Subtitle should be of minimum 2 characters length')
    .max(300, 'Subtitle should be of maximum 300 characters length')
    .required('Subtitle is required')
});
