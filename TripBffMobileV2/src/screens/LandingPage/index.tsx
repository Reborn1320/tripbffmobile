import React, { Component } from "react";
import { StyleSheet, ViewStyle, TextStyle } from "react-native"
import { Container, Content, View, Button, Text, Icon, Toast } from 'native-base';
import { connect } from "react-redux";
import * as RNa from "react-navigation";
import { isLoggedIn, loginUsingDeviceId } from "../../store/User/operations";
import { NavigationConstants } from "../_shared/ScreenConstants";
import NBColor from "../../theme/variables/commonColor.js";
import { mixins } from "../../_utils";
import SplashScreen from 'react-native-splash-screen';
import { StoreData } from "../../store/Interfaces";
import * as RNLocalize from "react-native-localize";
import { DEFAULT_LOCALE, LOCALE_VI } from "../_services/SystemConstants";

export interface Props {
  navigation: RNa.NavigationScreenProp<any, any>;
  locale: string
}

interface IMapDispatchToProps {
    isLoggedIn: () => Promise<boolean>
    loginUsingDeviceId: (locale) => Promise<void>;
}

class LandingPageComponent extends Component<any, any> {

  _displayLandingPageTimer;

  componentDidMount() {
    var tmp = this;
    this._displayLandingPageTimer = setTimeout(() => {
        this.props.isLoggedIn()
        .then(isLoggedIn => {
            let appLocale = tmp.props.locale;

            if (isLoggedIn) {
                this.props.navigation.navigate(NavigationConstants.Screens.Profile);
            }
            else {
              let locales = RNLocalize.getLocales();
              appLocale = locales && locales.length > 0 ? locales[0].languageCode : DEFAULT_LOCALE;
              appLocale = appLocale === DEFAULT_LOCALE || appLocale === LOCALE_VI
                               ? appLocale : DEFAULT_LOCALE;
              this._loginUniqueDevice(appLocale);
            }

            tmp.props.screenProps.changeLanguage(appLocale);
            SplashScreen.hide();
        })
    }, 500);    
  }  

  componentWillUnmount() {
      clearTimeout(this._displayLandingPageTimer);
  }

  private _loginUniqueDevice = async (locale) => {
    this.props
      .loginUsingDeviceId(locale)
      .then(() => {
        this.props.navigation.navigate(NavigationConstants.Screens.Profile);
      })
      .catch(() => {
        Toast.show({
          text: "Cannot continue without login",
        });
      });
  };

  render() {    
    return (
      <View></View>
    );
  }
}

interface Style {
    contentContainer: ViewStyle,
    appNameContainer: ViewStyle;
    firstAppName: TextStyle;
    secondAppName: TextStyle;
  }
  
  const styles = StyleSheet.create<Style>({
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'white'
    },
    appNameContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    firstAppName: {
        fontSize: 40,
        color: "black",
        ...mixins.themes.fontBold
    },
    secondAppName: {
        fontSize: 40,
        color: NBColor.brandPrimary,
        ...mixins.themes.fontBold
    }
  })
  

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {        
  return {
      locale: storeState.user.locale
  };
};

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
  return {
    isLoggedIn: () => dispatch(isLoggedIn()),
    loginUsingDeviceId: (locale) => dispatch(loginUsingDeviceId(locale)),
  };
};

const LandingPageScreen = connect(mapStateToProps, mapDispatchToProps)(LandingPageComponent);

export default LandingPageScreen;
