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

interface ApiServiceArguments {
  url: string;
  data?: any;
}

export interface IApiService {
  get: (args: ApiServiceArguments) => Promise<any>;
  post: (args: ApiServiceArguments) => Promise<any>;
  delete: (args: ApiServiceArguments) => Promise<any>;
}

export var loginApiService: IApiService = {
  get: (args: ApiServiceArguments) => loginApiInternal.get(args.url, { data: args.data }),
  post: (args: ApiServiceArguments) => loginApiInternal.post(args.url, { data: args.data }),
  delete: (args: ApiServiceArguments) => loginApiInternal.delete(args.url, { data: args.data }),
}

export var tripApiService: IApiService = {
  get: (args: ApiServiceArguments) => tripApiInternal.get(args.url, { data: args.data }),
  post: (args: ApiServiceArguments) => tripApiInternal.post(args.url, { data: args.data }),
  delete: (args: ApiServiceArguments) => tripApiInternal.delete(args.url, { data: args.data }),
}