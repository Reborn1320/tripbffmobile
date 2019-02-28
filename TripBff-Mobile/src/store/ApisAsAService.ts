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

var tripApiInternal = axios.create({
  baseURL: TRIP_URL,
  headers: {
    post: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
});

//todo
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

export interface ApiServiceArguments {
  data?: any;
}

export interface IApiService {
  get: (url: string, args?: ApiServiceArguments) => Promise<any>;
  post: (url: string, args?: ApiServiceArguments) => Promise<any>;
  delete: (url: string, args?: ApiServiceArguments) => Promise<any>;
}

export var loginApiService: IApiService = {
  get: (url: string, args?: ApiServiceArguments) => loginApiInternal.get(url, args ? args.data : undefined),
  post: (url: string, args?: ApiServiceArguments) => loginApiInternal.post(url, args ? args.data : undefined),
  delete: (url: string, args?: ApiServiceArguments) => loginApiInternal.delete(url, args ? args.data : undefined),
}

export var tripApiService: IApiService = {
  get: (url: string, args?: ApiServiceArguments) => tripApiInternal.get(url, args ? args.data : undefined),
  post: (url: string, args?: ApiServiceArguments) => tripApiInternal.post(url, args ? args.data : undefined),
  delete: (url: string, args?: ApiServiceArguments) => tripApiInternal.delete(url, args ? args.data : undefined),
}