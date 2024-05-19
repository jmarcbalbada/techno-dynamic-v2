import axios from "axios";

import config from "data/config";

const BASE_URL = `${config.API_URL}api/suggestions`;

export const SuggestionService = {
    // create suggestion or return suggestion if exist
  create_suggestion: (lesson_id) => 
    axios.post(`${BASE_URL}/`, { lesson_id } , {
    headers: {
      "Content-Type": "application/json",
    },
  }),
};
