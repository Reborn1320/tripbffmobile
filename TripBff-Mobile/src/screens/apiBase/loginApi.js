import axios from "axios";

export default axios.create({
  //baseURL: `http://192.168.2.101:3000`  // local: should use IP4 of current local computer to allow call API from native app
  baseURL: `http://10.2.11.200:3000`,
  headers: {
    post: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
});
