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
import { loginUsingUserPass } from "../../store/User/operations";
import DeviceInfo from 'react-native-device-info';
const uuidv4 = require('uuid/v4');
import AsyncStorage from "@react-native-community/async-storage";

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

        const access_token = data.accessToken;
        const user_id = data.userID;
        //todo login using `facebook/verify` withc `access_token` and `user_id`

        //todo user axios instead of fetch
        const responseBasicUser = fetch(`https://graph.facebook.com/me?fields=id,name,first_name,last_name&access_token=${data.accessToken}`);
        responseBasicUser
          .then((response) => response.json())
          .then((json) => {
            console.log("user data from graph", json);
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

  private _storeDataIntoStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
    }

    console.log('Done store data');
  }

  private _getDataFromStorage = async (key) => {
    let value = '';

    try {
      value = await AsyncStorage.getItem(key)
    } catch(e) {
      // error reading value
    }

    console.log('Done get data');

    return value;
  }

  removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch(e) {
      // remove error
    }
  
    console.log('Done remove data.')
  }

  private _loginUniqueDevice = async () => {    
    let key = "uniqueDeviceUUID";
    let uniqueDeviceUuid = await this._getDataFromStorage(key);

    if (!uniqueDeviceUuid) {
      uniqueDeviceUuid = uuidv4();
      await this._storeDataIntoStorage(key, uniqueDeviceUuid);
    } 

    console.log('uuid: ' + uniqueDeviceUuid);

    var postUser = {
      email: uniqueDeviceUuid.toString(),
      password: uniqueDeviceUuid.toString()
    };
    this.loginDetails(postUser.email, postUser.password);
  }

  //todo move LoginButton to atoms
  render() {
    
    return (
      <Container>
        <Content
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
          }}>
          <View>
            <LoginButton
              readPermissions={["public_profile", "user_photos", "user_posts"]}
              onLoginFinished={(error, result) =>
                this.loginFacebookSdk(error, result)
              }
              onLogoutFinished={() => console.log("logout.")}
            />
            <Button style={{ margin: 5 }} onPress={() => this.loginLocal()}>
              <Text>[Local] Continue without logging in</Text>
            </Button>

            <Button style={{ margin: 5 }} onPress={this._loginUniqueDevice}>
              <Text>[Unique Device] Continue without logging in</Text>
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
