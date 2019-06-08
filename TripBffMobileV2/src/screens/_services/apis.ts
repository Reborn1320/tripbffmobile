import axios from "axios";
import { uploadImageAsync } from "./Uploader/BlobUploader";
import { SSO_URL, TRIP_URL } from "./ServiceConstants";

export var loginApi = axios.create({
  baseURL: SSO_URL,
  headers: {
    post: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
});

export var tripApi = axios.create({
  baseURL: TRIP_URL,
  headers: {
    post: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
});

export var uploadFileApi = {
  upload: (uploadUrl: string, uri: string, data?: any) => {
    return uploadImageAsync(uploadUrl, _bearer, uri, data);
  }
};

var _bearer = "";
export function setAuthorizationHeader(token) {
  if (!token) throw "token should have value";

  _bearer = `Bearer ${token}`;
  
  console.log("update breader into axios", _bearer);
  //do not override global axios
  // axios.defaults.headers.common["Authorization"] = _bearer;

  tripApi = axios.create({
    baseURL: TRIP_URL,
    headers: {
      common: {
        "Authorization": _bearer,
      },
        post: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  });

}
