import React from "react";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import axiosMiddleware from "redux-axios-middleware";

import { Root } from "native-base";
import { createStackNavigator, createAppContainer, createSwitchNavigator, createTabNavigator } from "react-navigation";

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
import TestComponentScreen from "./_organisms/TripEditForm/__doc__/TripEditForm.doc";

import bffApp from "./store/reducers";
import ReduxThunk from "redux-thunk";
import { ThunkExtraArgumentsBase } from "./store";
import { mockLoginApiService, mockTripApiService } from "./store/MockApiService";
import LocationImageDetailScreen from "./screens/location/LocationImageDetail/LocationImageDetailScreen";
import { TripCarouselDoc } from "./_molecules/TripCarousel/TripCarousel.doc";

var mockLoginApi = mockLoginApiService;
var mockTripApi = mockTripApiService;
var extraThunk: ThunkExtraArgumentsBase = {
  loginApi: loginApi,
  api: tripApi,
  uploadApi: uploadFileApi,
  
  // loginApiService: mockLoginApi,
  // tripApiService: mockTripApi,
  loginApiService: loginApiService,
  tripApiService: tripApiService,
};

const store = createStore(
  bffApp,
  applyMiddleware(
    axiosMiddleware(loginApi),
    axiosMiddleware(tripApi),
    ReduxThunk.withExtraArgument(extraThunk)
  )
);

const navigationOptions =  {
  headerMode: "screen",
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#ff9900'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  },
} as any;

const TripCreationNavigator = createStackNavigator(
  {
    TripCreation: { screen: TripCreation },
    TripImportation: { screen: TripImportationScreen }, 
  },
  navigationOptions
);

const TripDetailsNavigator = createStackNavigator(
  {
    TripDetail: { screen: TripDetailScreenContainer },
    LocationDetail: { screen: LocationDetailScreen },
    LocationImageDetail: { screen: LocationImageDetailScreen },
    InfographicPreview: { screen: InfographicPreviewScreen },
  },
  navigationOptions
);

const ProfileNavigator = createStackNavigator(
  {
    Profile: {screen: ProfileScreenContainer },
    TripEdition: { screen: TripEditScreenContainer }, 
    LocationDetail: { screen: LocationDetailScreen },
    LocationImageDetail: { screen: LocationImageDetailScreen },
    InfographicPreview: { screen: InfographicPreviewScreen },
  },
  navigationOptions
);


const TestComponentNavigator = createStackNavigator(
  {
    Test: {screen: TripCarouselDoc },
  },
  {
    headerMode: "none",
    initialRouteParams: {
      tripId: "aaa",
      dateIdx: 1,
      locationId: "aa",
      imageId: "Aaaa",
      url: "https://placekitten.com/g/500/500",
      isFavorite: true,
    },
  }
);


const AppNavigator = createSwitchNavigator(
  {
    Login: { screen: LoginScreen },
    TripCreation: TripCreationNavigator,
    TripDetails: TripDetailsNavigator,    
    Profile: ProfileNavigator,
    Test: {screen: TestComponentNavigator },
    Home: { screen: HomeScreen },   
  },
  {
    initialRouteName: "Login"
  });

let Navigation = createAppContainer(AppNavigator);

export default () => (
  <Provider store={store}>
    <Root>
      <Navigation/>
    </Root>
  </Provider>
);

console.disableYellowBox = true;
