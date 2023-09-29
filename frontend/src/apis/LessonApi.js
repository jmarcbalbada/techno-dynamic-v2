import axios from 'axios';
import { LESSON_URL } from './APIConstants';

export const getLessons = async () => {
  // TODO: Add error handling and status codes
  const response = await axios.get(LESSON_URL);
  console.log(response.data);
  return response.data;
};
