import { isLocal } from '../utils/destinations';

// let apiUrl = 'http://localhost:8000/';
let apiUrl = 'https://technodynamicv2-73437bf08784.herokuapp.com/';
//
if (!isLocal) {
  let apiUrl = 'https://technodynamicv2-73437bf08784.herokuapp.com/';
}

const config = {
  API_URL: apiUrl
};

export default config;
