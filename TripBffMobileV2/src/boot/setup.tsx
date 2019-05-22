import React, { Component } from "react";
import { StyleProvider } from "native-base";
import { MenuProvider } from 'react-native-popup-menu';

import App from "../App";
import getTheme from "../theme/components";
import material from "../theme/variables/material";

export default class Setup extends Component<{}, {}> {
  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <MenuProvider>
          <App />
        </MenuProvider>
      </StyleProvider>
    );
  }
}