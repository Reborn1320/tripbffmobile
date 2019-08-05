import React, { Component } from "react";
import { View, Button, Text, Icon } from 'native-base';
import { ImageBackground, ViewStyle , StyleSheet, ImageStyle, TextStyle} from "react-native";
import { connect } from "react-redux";
import {
  AccessToken,
  LoginManager
} from "react-native-fbsdk";
import * as RNa from "react-navigation";
import { loginUsingFacebookAccessToken, loginUsingDeviceId } from "../../store/User/operations";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { mixins } from "../../_utils";

export interface Props {
  navigation: RNa.NavigationScreenProp<any, any>;
}

interface IMapDispatchToProps {
  loginUsingFacebookAccessToken: (userId, accessToken) => Promise<void>
  loginUsingDeviceId: () => Promise<void>
}

class Login extends Component<Props & IMapDispatchToProps, any>{
  private _loginFacebook = () => {
    var tmp =  this;

    LoginManager.logInWithReadPermissions(["public_profile", "user_photos", "user_posts"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            //console.log(data.accessToken.toString());
            console.log("getCurrentAccessToken data", data);
    
            tmp._loginFacebookAccess(data.userID, data.accessToken);
          });
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  }

  private _loginFacebookAccess = (facebookUserId, accessToken, isMoveToCreate = true) => {
    return this.props.loginUsingFacebookAccessToken(facebookUserId, accessToken)
      .then(() => {
        if (isMoveToCreate) {
          this.props.navigation.navigate(NavigationConstants.Screens.Profile);
        }
      });
  }  

  private _loginUniqueDevice = async (isMoveToCreate = true) => {    
    this.props.loginUsingDeviceId()
      .then(() => {
        if (isMoveToCreate) {
          this.props.navigation.navigate(NavigationConstants.Screens.Profile);
        }
      });
  }

  render() {
    return (
      <ImageBackground source={require('../../../assets/04.jpg')} style={styles.imageBackground}>
          <View style={styles.loginContainer}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Welcome to TripBFF.</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <Button
                iconLeft
                onPress={this._loginFacebook}
                style={styles.facebookButton}              
              >
                <Icon name='facebook-f' type="FontAwesome5" style={styles.facebookIcon}/> 
                <Text style={{...mixins.themes.fontNormal}}>Continue with Facebook</Text>
              </Button>             

              <Button style={styles.noLoginButton}
                dark onPress={this._loginUniqueDevice}>
                <Text style={{...mixins.themes.fontNormal}}>Continue without login</Text>
              </Button>
            </View>
        </View>
      </ImageBackground>

         
    );
  }
}

interface Style {
  imageBackground: ImageStyle;
  loginContainer: ViewStyle;
  welcomeContainer: ViewStyle;
  welcomeTitle: TextStyle;
  buttonsContainer: ViewStyle;
  facebookButton: ViewStyle;
  facebookIcon: TextStyle;
  noLoginButton: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  imageBackground: {
    width: '100%',
    height: '100%'
  },
  loginContainer: {
    flex: 1
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "flex-end"
  },
  welcomeTitle: {
    color: "white",
    alignSelf: "center",
    ...mixins.themes.fontNormal,
    fontSize: 30
  },
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  facebookButton: {
    margin: 5,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#4267B2",
    width: "70%"
  },
  facebookIcon: {
    fontSize: 16
  },
  noLoginButton: {
    margin: 5,              
    alignSelf: "center",
    justifyContent: "center",
    width: "70%"
  }
})

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
  return {
    loginUsingFacebookAccessToken: (userId, accessToken) => dispatch(loginUsingFacebookAccessToken(userId, accessToken, "")),
    loginUsingDeviceId: () => dispatch(loginUsingDeviceId()),
  };
};

const LoginScreen = connect(null, mapDispatchToProps)(Login);

export default LoginScreen;
