import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { Root, Icon } from "native-base";
import { createStackNavigator, createAppContainer, createSwitchNavigator, createBottomTabNavigator } from "react-navigation";
import HomeScreen from "./screens/home/index";
import TripDetailScreenContainer from "./screens/trip/detail/TripDetailScreenContainer";
import TripEditScreenContainer from "./screens/trip/edit/TripEditScreenContainer";
import TripCreation from "./screens/trip/create";
import TripImportationScreen from "./screens/trip/import";
import LocationDetailScreen from "./screens/location/detail";
import InfographicPreviewScreen from "./screens/trip/preview/index";
import { uploadFileApi } from "./screens/_services/apis";
import { loginApiService, tripApiService } from "./store/ApisAsAService";
import LoginScreen from "./screens/login/index";
import ProfileScreenContainer from "./screens/user/ProfileScreenContainer";
import TestComponentScreen from "./_organisms/TripEditForm/__doc__/TripEditForm.doc";
import bffApp from "./store/reducers";
import ReduxThunk from "redux-thunk";
import { ThunkExtraArgumentsBase } from "./store";
import { mockLoginApiService, mockTripApiService } from "./store/MockApiService";
import LocationImageDetailScreen from "./screens/location/LocationImageDetail/LocationImageDetailScreen";
import ImageUploadDoc from "./screens/trip/import/ImageUpload.doc";
import LandingPageScreen from "./screens/LandingPage";
import NBTheme from "./theme/variables/material.js";
import TripEditBasicScreen from "./screens/trip/create/TripEditBasic";
import { mixins } from "./_utils";
import UserSettingsScreen from "./screens/user/UserSetting";
import LanguageSelection from "./_organisms/User/LanguageSelection";
import { withNamespaces } from 'react-i18next';
import i18n from '../i18n';
import UserFeedback from "./_organisms/User/UserFeedback";
import NavigationService from './store/NavigationService';
import NBColor from "./theme/variables/commonColor.js";

var extraThunk: ThunkExtraArgumentsBase = {
  uploadApi: uploadFileApi,
  
  loginApiService: loginApiService,
  tripApiService: tripApiService,
};

const store = createStore(
  bffApp,
  applyMiddleware(
    ReduxThunk.withExtraArgument(extraThunk)
  )
);

const stackConfigs =  {
  headerMode: "screen",
  defaultNavigationOptions: {
    headerStyle: {
    },
    headerLayoutPreset: 'center',
    headerTintColor: NBColor.colorBackBlack,
    headerTitleStyle: {
      ...mixins.themes.fontBold,
      color: NBTheme.brandPrimary,
      textAlign: "center",
      alignSelf: "center",
      flex: 1,
      fontSize: 20,
      fontStyle: "normal",
      textTransform: 'capitalize'
    },
    headerBackTitle: null
  },
} as any;

const TripCreationNavigator = createStackNavigator(
  {
    TripCreation: { screen: TripCreation },
    TripImportation: { screen: TripImportationScreen }, 
  },
  stackConfigs
);

TripCreationNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const TripDetailsNavigator = createStackNavigator(
  {
    TripDetail: { screen: TripDetailScreenContainer },
    LocationDetail: { screen: LocationDetailScreen },
    LocationImageDetail: { screen: LocationImageDetailScreen },
    InfographicPreview: { screen: InfographicPreviewScreen },
    TripEditBasic: { screen: TripEditBasicScreen }
  },
  stackConfigs
);

const ProfileNavigator = createStackNavigator(
  {
    Profile: {screen: ProfileScreenContainer },
    UserSettings: { screen: UserSettingsScreen },
    TripEdition: { screen: TripEditScreenContainer }, 
    LocationDetail: { screen: LocationDetailScreen },
    LocationImageDetail: { screen: LocationImageDetailScreen },
    InfographicPreview: { screen: InfographicPreviewScreen },
    TripEditBasic: { screen: TripEditBasicScreen },
    LanguageSelection: { screen: LanguageSelection },
    UserFeedback: { screen: UserFeedback }
  },
  stackConfigs
);

ProfileNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const TestComponentNavigator = createStackNavigator(
  {
    Test: {screen: ImageUploadDoc },
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

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let iconName;

  if (routeName === 'Create') {
    iconName = 'md-add';
  } else if (routeName === 'Me') {
    iconName = 'md-contact';
  }

  return <Icon name={iconName}  style={{ fontSize: 30, color: tintColor, paddingHorizontal: 5 }} type="Ionicons" />;
};

const TabNavigator = createBottomTabNavigator({
  "Create": {
    screen: TripCreationNavigator
  },
  "Me": {
    screen: ProfileNavigator
  }
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) =>
      getTabBarIcon(navigation, focused, tintColor),
  }),
  tabBarOptions: {
    activeTintColor: NBTheme.brandPrimary,
    inactiveTintColor: 'gray',
    showLabel:false,
    // labelStyle: {
    //   fontSize: 10,
    //   ...mixins.themes.fontSemiBold,
    //   lineHeight: 13,
    //   fontStyle: "normal",
    //   marginBottom: 12
    // },
    // tabStyle: {
    //   height: 57
    // }
  },
});

const AppNavigator = createSwitchNavigator(
  {
    LandingPage: { screen: LandingPageScreen },
    Login: { screen: LoginScreen },
    TripDetails: TripDetailsNavigator,    
    TabMenu: TabNavigator,
    Test: {screen: TestComponentNavigator },
    Home: { screen: HomeScreen },   
  },
  {
    initialRouteName: "LandingPage"
  });

let Navigation = createAppContainer(AppNavigator);

class App extends React.Component<any, any> {
  
  changeLanguage = locale => {
    this.props.i18n.changeLanguage(locale);
  };

  render() {
    const { t } = this.props;

    return (
      <Provider store={store}>
        <Root>
          <Navigation screenProps={{
              changeLanguage: this.changeLanguage,
              t: t
            }} 
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}/>
        </Root>
      </Provider>
    );
  }
}

export default withNamespaces()(App);

console.disableYellowBox = true;
