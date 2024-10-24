import axios from 'axios';

import config from 'data/config';

const BASE_URL = `${config.API_URL}api/suggestions`;

export const SuggestionService = {
  // create insights

    retrieveSuggestedContent: (lesson_id, notification_id) =>
        axios.post(`${BASE_URL}s/retrieveSuggestedContent/`, { lesson_id, notification_id }),

    create_insights: (lesson_id, notification_id) =>
    axios.post(`${BASE_URL}/insights/`, { lesson_id, notification_id }),

  get_old_content: (lesson_id) =>
    axios.get(`${BASE_URL}/getoldcontent/${lesson_id}`),

  create_content: (lesson_id, notification_id) =>
    axios.post(`${BASE_URL}/contents/`, { lesson_id, notification_id }),

  accept_content: (lesson_id, new_content) =>
    axios.put(
      `${BASE_URL}/`,
      { lesson_id, new_content },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ),
  // Method to revert content
  revert_content: (lesson_id) =>
    axios.put(
      `${BASE_URL}/revert/`,
      { lesson_id },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ),
  // Method to delete suggestion
  delete_suggestion: (lesson_id) =>
    axios.delete(`${BASE_URL}/`, {
      data: { lesson_id },
      headers: {
        'Content-Type': 'application/json'
      }
    })
};
