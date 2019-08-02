import React, { Component } from "react";
import { Container, Content, View, Button, Text, Icon } from 'native-base';
import { connect } from "react-redux";
import {
  AccessToken,
  LoginManager
} from "react-native-fbsdk";
import * as RNa from "react-navigation";
import { loginUsingFacebookAccessToken, loginUsingDeviceId } from "../../store/User/operations";
import { NavigationConstants } from "../_shared/ScreenConstants";

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

  //todo move LoginButton to atoms
  render() {
    
    return (
      <Container>
        <Content
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: "white"
          }}>
          <View>
            <Button
              onPress={this._loginFacebook}
              style={{
                margin: 5,
                alignSelf: "center",
                backgroundColor: "#4267B2"              
              }}              
            >
              <Icon name='facebook-square' type="FontAwesome5"/> 
              <Text>Continue with Facebook</Text>
            </Button>
            <Text style={{
              alignSelf: "center"
            }}>---- OR ----</Text>

            <Button style={{
              margin: 5,              
              alignSelf: "center",
            }}
              dark onPress={this._loginUniqueDevice}>
              <Text>Continue without login</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
  return {
    loginUsingFacebookAccessToken: (userId, accessToken) => dispatch(loginUsingFacebookAccessToken(userId, accessToken, "")),
    loginUsingDeviceId: () => dispatch(loginUsingDeviceId()),
  };
};

const LoginScreen = connect(null, mapDispatchToProps)(Login);

export default LoginScreen;
