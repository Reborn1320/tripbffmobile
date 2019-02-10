import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AxiosInstance } from "axios";
import { uploadFileApi } from "../screens/_services/apis";
import { IApiService } from "./ApisAsAService";

//todo move into module
export type ThunkResultBase<R = Promise<any>, S = any> = ThunkAction<
  R,
  S,
  ThunkExtraArgumentsBase,
  any
>;

export type ThunkDispatchBase<S = any> = ThunkDispatch<
  S,
  ThunkExtraArgumentsBase,
  any
>;

export interface ThunkExtraArgumentsBase {
  loginApi: AxiosInstance;
  api: AxiosInstance;
  uploadApi: typeof uploadFileApi;

  loginApiService: IApiService;
  tripApiService: IApiService;
}