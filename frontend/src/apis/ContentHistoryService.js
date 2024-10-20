import axios from 'axios';
import config from 'data/config';

const BASE_URL = `${config.API_URL}api/lessons/history`;

export const ContentHistoryService = {
  // Create a new history entry for a specific lesson
  createHistory: (lesson_id, content) =>
    axios.post(`${BASE_URL}/lesson/${lesson_id}/`, { content }),

  createHistoryWithParent: (lesson_id, content, parent_id) =>
    axios.post(`${BASE_URL}/lesson/${lesson_id}/parent/${parent_id}/`, {
      content
    }),

  getCurrentVersionAndParent: (lesson_id) =>
    axios.get(`${BASE_URL}/lesson/${lesson_id}/checkVersion/`),

  // Get all history entries for a specific lessonId
  getHistoryByLessonId: (lesson_id) =>
    axios.get(`${BASE_URL}/lesson/${lesson_id}/`),

  // Get a specific history entry by historyId
  getHistoryByHistoryId: (history_id) =>
    axios.get(`${BASE_URL}/history/${history_id}/`),

  // Restore a specific history for a lesson by lessonId and historyId
  restoreHistory: (lesson_id, history_id) =>
    axios.put(`${BASE_URL}/restore/${lesson_id}/${history_id}/`),

  // Delete a specific history for a lesson by lessonId and historyId
  deleteHistory: (lesson_id, history_id) =>
    axios.delete(`${BASE_URL}/adminControl/${lesson_id}/${history_id}/`)
};
