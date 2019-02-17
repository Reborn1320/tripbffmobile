import React, { Component } from "react";

import { NavigationScreenProp } from "react-navigation";
import { AxiosInstance } from "axios";
import { uploadFileApi } from "../_services/apis";

// Component-specific props.
export interface PropsBase {
  navigation: NavigationScreenProp<any, any>;
}

//todo TBD
class LayoutContainer<T, S> extends React.Component<T & PropsBase, S> {
  constructor(props: T) {
    super(props as any); //todo remove any
  }
}
