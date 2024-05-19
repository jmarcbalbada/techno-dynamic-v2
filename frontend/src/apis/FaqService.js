import axios from "axios";

import config from "data/config";

const BASE_URL = `${config.API_URL}api/faq`;

export const FaqService = {
  count_faq: () => axios.get(`${BASE_URL}/count_faq`),
};
