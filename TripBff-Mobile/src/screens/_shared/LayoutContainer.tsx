import React, { Component } from "react";

import { NavigationScreenProp } from "react-navigation";

// Component-specific props.
export interface BaseProps {
  navigation: NavigationScreenProp<any, any>
}

//todo TBD
class LayoutContainer<T, S> extends React.Component<T & BaseProps, S> {
  constructor(props: T) {
    super(props as any); //todo remove any
  }
}