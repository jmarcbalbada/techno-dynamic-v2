import { isLocal } from "../utils/destinations";

let apiUrl = 'http://172.16.103.217/'

if (isLocal) {
  apiUrl = 'http://172.16.103.217/'
}

const config = {
  API_URL: apiUrl,
};

export default config;