import { isLocal } from "../utils/destinations";

let apiUrl = 'https://techno-learn.onrender.com/'

if (!isLocal) {
  apiUrl = 'http://127.0.0.1:8000/'
}

const config = {
  API_URL: apiUrl,
};

export default config;