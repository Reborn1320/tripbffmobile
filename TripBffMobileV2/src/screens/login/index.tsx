import React, { Component } from "react";
import { View, Button, Text, Icon, Toast } from "native-base";
import {
  ImageBackground,
  ViewStyle,
  StyleSheet,
  ImageStyle,
  TextStyle,
} from "react-native";
import { connect } from "react-redux";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import {
  loginUsingFacebookAccessToken,
  loginUsingDeviceId,
} from "../../store/User/operations";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { mixins } from "../../_utils";
import { withNamespaces } from "react-i18next";
import { PropsBase } from "../_shared/LayoutContainer";
import { StoreData } from "../../store/Interfaces";
import axios from "axios";
import Flurry from 'react-native-flurry-sdk';

export interface Props extends PropsBase {
  locale: string,
  userId: string
}

interface IMapDispatchToProps {
  loginUsingFacebookAccessToken: (userId, accessToken, loggedUserId, facebookUserEmail) => Promise<void>;
  loginUsingDeviceId: (locale) => Promise<void>;
}

class Login extends Component<Props & IMapDispatchToProps, any> {
  private _loginFacebook = () => {
    Flurry.logEvent('Login Facebook');
    var tmp = this;

    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            //get user info
            let uri = "https://graph.facebook.com/" + data.userID + "?fields=email&access_token=" + data.accessToken;
            
            axios.get(uri)
                .then(value => {
                  return value.data.email;
                },
                (error) => {
                  return "";
                })
                .then((email) => {
                  tmp._loginFacebookAccess(data.userID, data.accessToken, email);
                })
          });
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  };

  private _loginFacebookAccess = (
    facebookUserId,
    accessToken,
    email,
    isMoveToCreate = true
  ) => {
    return this.props
      .loginUsingFacebookAccessToken(facebookUserId, accessToken, this.props.userId, email)
      .then(() => {
        if (isMoveToCreate) {
          this.props.navigation.navigate(NavigationConstants.Screens.NewsFeed);
        }
      })
      .catch(() => {
        Toast.show({
          text: "Cannot perform facebook login",
        });
      });
  };

  private _loginUniqueDevice = async () => {
    this.props
      .loginUsingDeviceId(this.props.locale)
      .then(() => {
        this.props.navigation.navigate(NavigationConstants.Screens.NewsFeed);
      })
      .catch(() => {
        Toast.show({
          text: "Cannot continue without login",
        });
      });
  };

  render() {
    const { t, i18n } = this.props;

    return (
      <View>
        <ImageBackground
          source={require("../../../assets/04_background.jpg")}
          style={styles.imageBackground}
        ></ImageBackground>

        <View style={[styles.overlay]} />

        <View style={styles.loginContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>{t("login:welcome_title")}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              iconLeft
              onPress={this._loginFacebook}
              style={styles.facebookButton}
            >
              <Icon
                name="facebook-f"
                type="FontAwesome5"
                style={styles.facebookIcon}
              />
              <Text style={styles.buttonTitle}>
                {t("login:facebook_button_title")}
              </Text>
            </Button>

            <Button
              style={styles.noLoginButton}
              dark
              onPress={this._loginUniqueDevice}
            >
              <Text style={styles.buttonTitle}>
                {t("login:no_login_button_title")}
              </Text>
            </Button>
          </View>
        </View>
      </View>
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
  buttonTitle: TextStyle;
  overlay: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  loginContainer: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeTitle: {
    color: "white",
    textAlign: "center",
    ...mixins.themes.fontNormal,
    fontSize: 44,
  },
  buttonsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  facebookButton: {
    margin: 5,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#4267B2",
    width: "80%",
  },
  facebookIcon: {
    fontSize: 16,
  },
  noLoginButton: {
    margin: 5,
    alignSelf: "center",
    justifyContent: "center",
    width: "80%",
  },
  buttonTitle: {
    ...mixins.themes.fontNormal,
  },
  overlay: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0.2,
    backgroundColor: "black",
    width: "100%",
    height: "100%",
  },
});

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {        
  return {
      locale: storeState.user.locale,
      userId: storeState.user.id,
  };
};

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
  return {
    loginUsingFacebookAccessToken: (userId, accessToken, loggedUserId, facebookUserEmail) =>
      dispatch(loginUsingFacebookAccessToken(userId, accessToken, loggedUserId, facebookUserEmail)),
    loginUsingDeviceId: (locale) => dispatch(loginUsingDeviceId(locale)),
  };
};

const LoginScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default withNamespaces(["login"])(LoginScreen);
