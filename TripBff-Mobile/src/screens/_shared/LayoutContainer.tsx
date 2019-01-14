import React, { Component } from "react";

import { NavigationScreenProp } from "react-navigation";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AxiosInstance } from "axios";
import { uploadFileApi } from "../_services/apis";

// Component-specific props.
export interface PropsBase {
  navigation: NavigationScreenProp<any, any>;
}

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
}

//todo TBD
class LayoutContainer<T, S> extends React.Component<T & PropsBase, S> {
  constructor(props: T) {
    super(props as any); //todo remove any
  }
}
