import { isLocal } from '../utils/destinations';

// let apiUrl = 'http://localhost:8000/';
let apiUrl = 'https://143.44.165.11:8000/';
// let apiUrl = 'http://192.168.1.12:8000/'; // on network local (still local) allow this when testing on same networks

// if (!isLocal) {
//   // Assuming your backend is not running on the same machine as your frontend
//   // Adjust the IP address accordingly if your backend is running on a different machine
//   // apiUrl = 'http://172.16.103.217:8000/';
//   // let apiUrl = 'http://localhost:8000/';
//   // let apiUrl = 'http://127.0.0.1:8000/';
//   let apiUrl = 'http://192.168.1.12:8000/';
// }

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
