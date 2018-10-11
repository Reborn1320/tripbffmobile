import React from "react";

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

import { Root } from "native-base";
import { createDrawerNavigator, createStackNavigator } from "react-navigation";

import BasicFab from "./screens/fab/basic";
import HomeScreen from "./screens/home/index";
import NHFab from "./screens/fab";
import PhotoScreen from "./screens/test/photo";
import TripDetail from "./screens/trip/detail";
import TripCreation from "./screens/trip/create";
import TripImportationScreen from "./screens/trip/import";
import LocationDetailScreen from "./screens/location/detail";

import bffApp from "./reducers"

const client = axios.create({
  baseURL: 'https://api.github.com',
  responseType: 'json'
});

const store = createStore(bffApp, applyMiddleware(axiosMiddleware(client)));

const Drawer = createDrawerNavigator(
  {
    Home: { screen: HomeScreen },
    NHFab: { screen: NHFab },
    TripImportation: { screen: TripImportationScreen },
    Photos: { screen: PhotoScreen },
  },
  {
    initialRouteName: "TripImportation",
    initialRouteParams: {
      tripId: 3
    },
    contentOptions: {
      activeTintColor: "#e91e63"
    }
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },

    BasicFab: { screen: BasicFab },
    TripDetail: {screen: TripDetail },
    LocationDetail: {screen: LocationDetailScreen },
    TripCreation: {screen: TripCreation },
    TripImportation: {screen: TripImportationScreen },
    Photos: {screen: PhotoScreen },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);

export default () => 
  <Provider store={store}>
    <Root>
      <AppNavigator />
    </Root>
  </Provider>;

console.disableYellowBox = true;