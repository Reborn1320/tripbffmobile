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

var _bearer = "";
export function setAuthorizationHeader(token) {
  if (!token) throw "token should have value";

  _bearer = `Bearer ${token}`;
  console.log("update rearer into axios", _bearer);

  //do not override global axios
  // axios.defaults.headers.common["Authorization"] = _bearer;

  tripApiInternal = axios.create({
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

export function getAuthorizationHeader() {
  return _bearer;
}

export interface ApiServiceArguments {
  data?: any;
  config?: any;
}

export interface IApiService {
  get: (url: string, args?: ApiServiceArguments) => Promise<any>;
  post: (url: string, args?: ApiServiceArguments) => Promise<any>;
  delete: (url: string, args?: ApiServiceArguments) => Promise<any>;
  patch: (url: string, args?: ApiServiceArguments) => Promise<any>;
}

export var loginApiService: IApiService = {
  get: (url: string, args?: ApiServiceArguments) => loginApiInternal.get(url, args ? args.config : undefined),
  post: (url: string, args?: ApiServiceArguments) => loginApiInternal.post(url, args ? args.data : undefined, args ? args.config : undefined),
  delete: (url: string, args?: ApiServiceArguments) => loginApiInternal.delete(url, args ? args.config : undefined),
  patch: (url: string, args?: ApiServiceArguments) => loginApiInternal.patch(url, args ? args.data : undefined, args ? args.config : undefined),
}

export var tripApiService: IApiService = {
  get: (url: string, args?: ApiServiceArguments) => tripApiInternal.get(url, args ? args.config : undefined),
  post: (url: string, args?: ApiServiceArguments) => tripApiInternal.post(url, args ? args.data : undefined, args ? args.config : undefined),
  delete: (url: string, args?: ApiServiceArguments) => tripApiInternal.delete(url, args ? args.config : undefined),
  patch: (url: string, args?: ApiServiceArguments) => tripApiInternal.patch(url, args ? args.data : undefined, args ? args.config : undefined),
}