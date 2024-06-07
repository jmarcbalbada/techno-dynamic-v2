// src/apis/FaqService.js

import axios from 'axios';
import config from 'data/config';

const BASE_URL = `${config.API_URL}api/faqs`;

export const FaqService = {
  count_faq: () => axios.get(`${BASE_URL}/`),
  getGeneralContextGroup: (params) => axios.get(`${BASE_URL}/paginated_general_context_group/`, { params }),
  getFilteredQuestions: (params) => axios.get(`${BASE_URL}/paginated_questions/`, { params }),

};

export default FaqService;
