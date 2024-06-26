import { isLocal } from '../utils/destinations';

let apiUrl = 'http://localhost:8000/';

if (!isLocal) {
  // Assuming your backend is not running on the same machine as your frontend
  // Adjust the IP address accordingly if your backend is running on a different machine
  apiUrl = 'http://172.16.103.217:8000/';
}

const config = {
  API_URL: apiUrl
};

export default config;

// import { isLocal } from "../utils/destinations";

// let apiUrl = 'http://172.16.103.217/'

// if (isLocal) {
//   apiUrl = 'http://172.16.103.217/'
// }

// const config = {
//   API_URL: apiUrl,
// };

// export default config;
