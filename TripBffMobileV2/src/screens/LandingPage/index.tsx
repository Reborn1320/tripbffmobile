import React, { Component } from "react";
import { StyleSheet, ViewStyle, TextStyle } from "react-native"
import { Container, Content, View, Button, Text, Icon } from 'native-base';
import { connect } from "react-redux";
import * as RNa from "react-navigation";
import { isLoggedIn } from "../../store/User/operations";
import { NavigationConstants } from "../_shared/ScreenConstants";
import NBColor from "../../theme/variables/commonColor.js";
import { mixins } from "../../_utils";
import SplashScreen from 'react-native-splash-screen';
import { StoreData } from "../../store/Interfaces";
import I18n from 'react-native-i18n';

export interface Props {
  navigation: RNa.NavigationScreenProp<any, any>;
  locale: string
}

interface IMapDispatchToProps {
    isLoggedIn: () => Promise<boolean>
}

class LandingPageComponent extends Component<any, any> {

  _displayLandingPageTimer;

  componentDidMount() {
    this._displayLandingPageTimer = setTimeout(() => {
        this.props.isLoggedIn()
        .then(isLoggedIn => {
            I18n.locale = this.props.locale;
            this.props.screenProps.setLocale(this.props.locale);

            if (isLoggedIn) {
                this.props.navigation.navigate(NavigationConstants.Screens.Profile);
            }
            else {
                this.props.navigation.navigate(NavigationConstants.Screens.Login);
            }

            SplashScreen.hide();
        })
    }, 500);    
  }  

  componentWillUnmount() {
      clearTimeout(this._displayLandingPageTimer);
  }

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
    isLoggedIn: () => dispatch(isLoggedIn())
  };
};

const LandingPageScreen = connect(mapStateToProps, mapDispatchToProps)(LandingPageComponent);

export default LandingPageScreen;
