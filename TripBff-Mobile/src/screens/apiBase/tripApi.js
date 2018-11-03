import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default axios.create({
  baseURL: `http://192.168.2.101:8000` // local: should use IP4 of current local computer to allow call API from native app
});