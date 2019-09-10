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
  constructor(props) {
    super(props);
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
      Ionicons: require("react-native-vector-icons/Fonts/Ionicons.ttf"),
      FontAwesome: require("react-native-vector-icons/Fonts/FontAwesome.ttf"),
      FontAwesome5_Solid: require("react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf"),
      FontAwesome5_Regular: require("react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf"),
      FontAwesome5_Brands: require("react-native-vector-icons/Fonts/FontAwesome5_Brands.ttf"),
      MaterialIcons: require("react-native-vector-icons/Fonts/MaterialIcons.ttf")
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