import axios from "axios";
import { uploadImageAsync } from "../screens/_services/Uploader/BlobUploader";
import { SSO_URL, TRIP_URL } from "../screens/_services/ServiceConstants";

var loginApiInternal = axios.create({
  baseURL: SSO_URL,
  headers: {
    post: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
});

var tripApi = axios.create({
  baseURL: TRIP_URL,
  headers: {
    post: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
});

var uploadFileApi = {
  upload: (uploadUrl: string, uri: string, data?: any) => {
    return uploadImageAsync(uploadUrl, _bearer, uri, data);
  }
};

var _bearer = "";
export function setAuthorizationHeader(token) {
  if (!token) throw "token should have value";

  _bearer = `Bearer ${token}`;
  axios.defaults.headers.common["Authorization"] = _bearer;
}

export var loginApiService = function loginApi(url: string, method: string, data: any): Promise<any> {
  return loginApiInternal.request({
    url,
    method,
    data,
  });
}