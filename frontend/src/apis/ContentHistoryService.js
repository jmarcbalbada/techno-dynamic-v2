import axios from 'axios';
import config from 'data/config';

const BASE_URL = `${config.API_URL}api/lessons/history`;

export const ContentHistoryService = {
  // Create a new history entry for a specific lesson
  createHistory: (lesson_id, content) =>
    axios.post(`${BASE_URL}/lesson/${lesson_id}/`, { content }),

  // Get all history entries for a specific lessonId
  getHistoryByLessonId: (lesson_id) =>
    axios.get(`${BASE_URL}/lesson/${lesson_id}/`),

  // Get a specific history entry by historyId
  getHistoryByHistoryId: (history_id) =>
    axios.get(`${BASE_URL}/history/${history_id}/`)
};
