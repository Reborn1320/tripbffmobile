import React from "react";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import axiosMiddleware from "redux-axios-middleware";

import { Root } from "native-base";
import { createStackNavigator } from "react-navigation";

import HomeScreen from "./screens/home/index";
import TripDetail from "./screens/trip/detail";
import TripCreation from "./screens/trip/create";
import TripImportationScreen from "./screens/trip/import";
import LocationDetailScreen from "./screens/location/detail";
import InfographicPreviewScreen from "./screens/trip/preview/index";
import { tripApi, loginApi, uploadFileApi } from "./screens/_services/apis";
import LoginScreen from "./screens/login/index";

import bffApp from "./reducers";
import ReduxThunk from "redux-thunk";

const store = createStore(
  bffApp,
  applyMiddleware(
    axiosMiddleware(loginApi),
    axiosMiddleware(tripApi),
    ReduxThunk.withExtraArgument({
      loginApi: loginApi,
      api: tripApi,
      uploadApi: uploadFileApi
    })
  )
);

// const Drawer = createDrawerNavigator(
//   {
//     Home: { screen: HomeScreen },
//     Login: { screen: LoginScreen },
//     NHFab: { screen: NHFab },
//     TripImportation: { screen: TripImportationScreen }
//   },
//   {
//     initialRouteName: "Login",
//     initialRouteParams: {
//       tripId: 3
//     },
//     contentOptions: {
//       activeTintColor: "#e91e63"
//     }
//   }
// );

const AppNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Login: { screen: LoginScreen },
    TripDetail: { screen: TripDetail },
    LocationDetail: { screen: LocationDetailScreen },
    TripCreation: { screen: TripCreation },
    TripImportation: { screen: TripImportationScreen },
    InfographicPreview: { screen: InfographicPreviewScreen }
  },
  {
    initialRouteName: "Home",
    initialRouteParams: {
      tripId: 3
    },
    headerMode: "none"
  }
);

export default () => (
  <Provider store={store}>
    <Root>
      <AppNavigator />
    </Root>
  </Provider>
);

console.disableYellowBox = true;
