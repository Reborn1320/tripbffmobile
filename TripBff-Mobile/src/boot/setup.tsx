import * as Expo from "expo";
import React, { Component } from "react";
import { StyleProvider } from "native-base";
import { MenuProvider } from 'react-native-popup-menu';

import App from "../App";
import getTheme from "../theme/components";
import material from "../theme/variables/material";

interface State {
  isReady: boolean;
}
export default class Setup extends Component<{}, State> {
  constructor() {
    super({});
    this.state = {
      isReady: false
    };
  }
  componentWillMount() {
    this.loadFonts();
  }
  async loadFonts() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      FontAwesome: require("@expo/vector-icons/fonts/FontAwesome.ttf")
    });
    this.setState({ isReady: true });
  }
  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return (
      <StyleProvider style={getTheme(material)}>
        <MenuProvider>
          <App />
        </MenuProvider>
      </StyleProvider>
    );
  }
}