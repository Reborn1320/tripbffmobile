import React, { Component } from "react";
import { Container, Content, View, Button, Text, Icon } from 'native-base';
import { connect, DispatchProp } from "react-redux";
import {
  LoginButton,
  AccessToken,
  LoginManager
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
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  }

  private _loginFacebookAccess = (facebookUserId, accessToken, isMoveToCreate = true) => {
    return this.props
      .dispatch<Promise<any>>(loginUsingFacebookAccessToken(facebookUserId, accessToken))
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

function mapDispatchToProps(dispatch) {
  return {
    dispatch, //todo remove this dispatch, and do something similar to the one below
  };
}

const LoginScreen = connect(null, mapDispatchToProps)(Login);

export default LoginScreen;
