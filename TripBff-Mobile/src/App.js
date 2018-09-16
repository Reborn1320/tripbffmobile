import React from "react";
import { Root } from "native-base";
import { createDrawerNavigator, createStackNavigator } from "react-navigation";
import { SideBar, Container, Button, Header, Content, Text } from "native-base";

import BasicFab from "./screens/fab/basic";
import Home from "./screens/home/";
import NHFab from "./screens/fab/";

const Drawer = createDrawerNavigator(
  {
    Home: { screen: Home },
    NHFab: { screen: NHFab },
  },
  {
    initialRouteName: "Home",
    contentOptions: {
      activeTintColor: "#e91e63"
    }
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },

    BasicFab: { screen: BasicFab },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);

export default () => 
  <Root>
    <AppNavigator />
  </Root>;