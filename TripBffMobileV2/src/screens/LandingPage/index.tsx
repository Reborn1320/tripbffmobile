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

export interface Props {
  navigation: RNa.NavigationScreenProp<any, any>;
  locale: string
}

interface IMapDispatchToProps {
    isLoggedIn: () => Promise<boolean>
    loginUsingDeviceId: () => Promise<void>;
}

class LandingPageComponent extends Component<any, any> {

  _displayLandingPageTimer;

  componentDidMount() {
    var tmp = this;
    this._displayLandingPageTimer = setTimeout(() => {
        this.props.isLoggedIn()
        .then(isLoggedIn => {
            tmp.props.screenProps.changeLanguage(tmp.props.locale);

            if (isLoggedIn) {
                this.props.navigation.navigate(NavigationConstants.Screens.Profile);
            }
            else {
              this._loginUniqueDevice();
            }

            SplashScreen.hide();
        })
    }, 500);    
  }  

  componentWillUnmount() {
      clearTimeout(this._displayLandingPageTimer);
  }

  private _loginUniqueDevice = async () => {
    this.props
      .loginUsingDeviceId()
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
    loginUsingDeviceId: () => dispatch(loginUsingDeviceId()),
  };
};

const LandingPageScreen = connect(mapStateToProps, mapDispatchToProps)(LandingPageComponent);

export default LandingPageScreen;
