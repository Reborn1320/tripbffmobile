import React, { Component } from "react";
import { Container, Content, View, Button, Text } from 'native-base';
import { connect, DispatchProp } from "react-redux";
import {
  LoginButton,
  AccessToken
} from "react-native-fbsdk";
import { ThunkDispatch } from "redux-thunk";
import { PropsBase } from "../_shared/LayoutContainer";
import * as RNa from "react-navigation";
import { loginUsingUserPass, loginUsingFacebookAccessToken, loginUsingDeviceId } from "../../store/User/operations";
import { NavigationConstants } from "../_shared/ScreenConstants";

export interface Props extends IMapDispatchToProps, DispatchProp, PropsBase {
  dispatch: ThunkDispatch<any, null, any>;
  navigation: RNa.NavigationScreenProp<any, any>;
}

interface IMapDispatchToProps {
}

class Login extends Component<Props, any>{

  constructor(props) {
    super(props);
  }

  //todo move login facebook to store User
  loginFacebookSdk(error, result) {
    var tmp = this;
    if (error) {
      console.log("login has error: " + result.error);
    } else if (result.isCancelled) {
      console.log("login is cancelled.");
    } else {
      AccessToken.getCurrentAccessToken().then(data => {

        console.log(data.accessToken.toString());
        console.log("getCurrentAccessToken data", data);

        this.loginFacebookAccess(data.userID, data.accessToken);

        // //todo user axios instead of fetch
        // const responseBasicUser = fetch(`https://graph.facebook.com/me?fields=id,name,first_name,last_name&access_token=${data.accessToken}`);
        // responseBasicUser
        //   .then((response) => response.json())
        //   .then((json) => {
        //     console.log("user data from graph", json);
        //     var user = {
        //       // Some user object has been set up somewhere, build that user here
        //       email: json.email ? json.email : json.id,
        //       password: '123456',
        //       username: json.name,
        //       lastName: "",
        //       firstName: "",
        //       fullName: json.name
        //     };
        //     console.log(user);
        //     tmp.loginDetails(user.email, user.password);
        //   })
        //   .catch(() => {
        //     console.log('ERROR GETTING DATA FROM FACEBOOK');
        //   });
      });
    }
  }

  loginFacebookAccess(facebookUserId, accessToken, isMoveToCreate = true) {
    return this.props
      .dispatch<Promise<any>>(loginUsingFacebookAccessToken(facebookUserId, accessToken))
      .then(() => {
        if (isMoveToCreate) {
          this.props.navigation.navigate(NavigationConstants.Screens.TripCreation);
        }
      });
  }


  loginLocal() {
    var postUser = {
      email: "bbb",
      password: "123456"
    };
    this.loginDetails(postUser.email, postUser.password);
  }

  loginDetails(email, password, isMoveToCreate = true) {
    return this.props
      .dispatch<Promise<any>>(loginUsingUserPass(email, password))
      .then(() => {
        if (isMoveToCreate) {
          this.props.navigation.navigate(NavigationConstants.Screens.TripCreation);
        }
      });
  }

  private _loginUniqueDevice = async (isMoveToCreate = true) => {    
    this.props
      .dispatch<Promise<any>>(loginUsingDeviceId())
      .then(() => {
        if (isMoveToCreate) {
          this.props.navigation.navigate(NavigationConstants.Screens.TripCreation);
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
            <LoginButton
              style={{
                width: 300,
                height: 30,
                marginLeft: 5,
                marginRight: 5,
              }}
              readPermissions={["public_profile", "user_photos", "user_posts"]}
              onLoginFinished={(error, result) =>
                this.loginFacebookSdk(error, result)
              }
              onLogoutFinished={() => console.log("logout.")}
            />
            <Button style={{ margin: 5 }} block onPress={() => this.loginLocal()}>
              <Text>[Local] Continue without logging in</Text>
            </Button>
            <Text style={{
              margin: 10,
              marginTop: 20,
              alignSelf: "center"
            }}>---- OR ----</Text>

            <Button style={{
              margin: 5,
              alignSelf: "center",
            }}
              transparent dark onPress={this._loginUniqueDevice}>
              <Text>SKIP</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch, //todo remove this dispatch, and do something similar to the one below
  };
}

const LoginScreen = connect(null, mapDispatchToProps)(Login);

export default LoginScreen;
