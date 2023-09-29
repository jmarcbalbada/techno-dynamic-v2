import axios from 'axios';
import { LESSON_URL } from './APIConstants';

export const getLessons = async () => {
  const response = await axios.get(LESSON_URL);
  console.log(response.data);
  return response.data;
};
