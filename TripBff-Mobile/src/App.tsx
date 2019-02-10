import React from "react";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import axiosMiddleware from "redux-axios-middleware";

import { Root } from "native-base";
import { createStackNavigator } from "react-navigation";

import HomeScreen from "./screens/home/index";
import TripDetailScreenContainer from "./screens/trip/detail/TripDetailScreenContainer";
import TripEditScreenContainer from "./screens/trip/edit/TripEditScreenContainer";
import TripCreation from "./screens/trip/create";
import TripImportationScreen from "./screens/trip/import";
import LocationDetailScreen from "./screens/location/detail";
import InfographicPreviewScreen from "./screens/trip/preview/index";
import { tripApi, loginApi, uploadFileApi } from "./screens/_services/apis";
import { loginApiService, tripApiService } from "./store/ApisAsAService";
import LoginScreen from "./screens/login/index";
import ProfileScreenContainer from "./screens/user/ProfileScreenContainer";

import bffApp from "./store/reducers";
import ReduxThunk from "redux-thunk";
import { ThunkExtraArgumentsBase } from "./store";

var extraThunk: ThunkExtraArgumentsBase = {
  loginApi: loginApi,
  api: tripApi,
  uploadApi: uploadFileApi,
  loginApiService,
  tripApiService,
};

const store = createStore(
  bffApp,
  applyMiddleware(
    axiosMiddleware(loginApi),
    axiosMiddleware(tripApi),
    ReduxThunk.withExtraArgument(extraThunk)
  )
);

const AppNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Login: { screen: LoginScreen },
    Profile: {screen: ProfileScreenContainer },
    TripDetail: { screen: TripDetailScreenContainer },
    LocationDetail: { screen: LocationDetailScreen },
    TripCreation: { screen: TripCreation },
    TripImportation: { screen: TripImportationScreen },
    TripEdition: { screen: TripEditScreenContainer },
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
