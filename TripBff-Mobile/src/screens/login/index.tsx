import React, { Component } from "react";
import { Container, Content, View, Button, Text, Footer } from 'native-base';
import { connect, DispatchProp } from "react-redux";
import {
    LoginButton,
    AccessToken
  } from "react-native-fbsdk";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { ThunkDispatch } from "redux-thunk";
import { PropsBase } from "../_shared/LayoutContainer";
import * as RNa from "react-navigation";

import AppFooter from "../shared/AppFooter"
import { loginUsingUserPass } from "../../_organisms/user/operations";
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

    loginFacebookSdk(error, result) {
        var tmp =  this;
        if (error) {
          console.log("login has error: " + result.error);
        } else if (result.isCancelled) {
          console.log("login is cancelled.");
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            console.log(data.accessToken.toString());

            const responseBasicUser = fetch(`https://graph.facebook.com/me?fields=email,name&access_token=${data.accessToken}`);
            responseBasicUser
                .then((response) => response.json())
                .then((json) => {
                    var user = {
                    // Some user object has been set up somewhere, build that user here
                        email: json.email ? json.email : json.id,
                        password: '123456',
                        username: json.name,
                        lastName: "",
                        firstName: "",
                        fullName: json.name
                    };   
                    console.log(user);
                    tmp.loginDetails(user.email, user.password);
                })
                .catch(() => {
                    console.log('ERROR GETTING DATA FROM FACEBOOK');
                });            
          });
        }
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
              this.props.navigation.navigate("TripCreation");
            }
          });
      }

    render() {
        return (
            <Container>
                <Content 
                        contentContainerStyle={{ 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        flex: 1 }}>
                    <View>   
                        <LoginButton                
                            readPermissions={["public_profile", "user_photos", "user_posts"]}
                            onLoginFinished={(error, result) =>
                                this.loginFacebookSdk(error, result)
                            }
                            onLogoutFinished={() => console.log("logout.")}
                        />   
                        <Button style={{ margin: 5 }} onPress={() => this.loginLocal()}>
                            <Text>Continue without logging in</Text>
                        </Button>
                    </View>
                </Content> 
                <Footer>
                    <AppFooter navigation={this.props.navigation} activeScreen={NavigationConstants.Screens.Login} />
                </Footer>
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
