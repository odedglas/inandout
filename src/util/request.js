import axios from 'axios'
import {config} from '../config/firebase';
import firebaseService from '../service/firebase';

const API_URL = config.apiUrl;

//Creating Axios instance
const instance = axios.create({
  baseURL: API_URL
});

//Setting up on our instance tha promise all
instance.all = axios.all;

const headers = () => ({
  'headers': {'Authorization': 'Bearer ' + firebaseService.token}
});

export default {

  get: (url) => instance.get(url, headers()).then(d => d.data),
  post: (url, data) => instance.post(url, data, headers()).then(d => d.data),
  promise: (config) => {

    return instance({...headers(), ...config});

  },
  promiseAll: (requests) => {

    let promises = [];

    for (let i = 0; i < requests.length; i++) {

      const requestConfig = requests[i];

      //Setting up get request
      promises.push(instance(requestConfig));
    }

    return instance.all(promises).catch(
      (e) => console.log("Failed on promise all:", e)
    );

  },
}
