import React from "react";
import { FlatList } from "react-native";
import { Container, Header, Content, Button, Icon, Text, ListItem, View } from 'native-base';
import { Footer, FooterTab } from 'native-base';

import { connect } from 'react-redux';

import styles from "./styles";
import { listRepos } from './reducer';
import * as RNa from "react-navigation";
import Expo from "expo";
import loginApi from '../apiBase/loginApi';
import tripApi from '../apiBase/tripApi';
import { StoreData } from "../../Interfaces";
import { addToken } from '../auth/actions';
import { AsyncStorage } from "react-native";
import { ShareDialog, LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';

export interface Props extends IMapDispatchToProps {
  navigation: RNa.NavigationScreenProp<any, any>
  repos: Array<any>
}

interface IMapDispatchToProps {
  listRepos: (name: string) => void,
  addToken: (user: StoreData.UserVM) => void
}

class Home extends React.Component<Props, any>  {

  constructor(props) {
    super(props);
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: 'https://www.facebook.com/',
    };

    const photoUri01 = 'file:///storage/emulated/0/Download/waiting-for-android-5a8833.jpg',
          photoUri02 = 'file:///storage/emulated/0/Download/Image03.jpg',
          photoUri03 = 'file:///storage/emulated/0/Download/Image04.jpg';

    const sharePhotoContent = {
        contentType: 'photo',
        photos: [{ imageUrl: photoUri01 }, { imageUrl: photoUri02 }, { imageUrl: photoUri03 }],
      }

    this.state = {
      shareLinkContent: shareLinkContent,
      sharePhotoContent: sharePhotoContent
    };
  }

  componentDidMount() {
    this.props.listRepos('relferreira');
  }

  renderItem = ({ item }) => (
    <ListItem noIndent
    onPress={() => this.props.navigation.navigate("TripDetail", { tripDetail: item.name })}>
      <Text
        style={styles.item}        
      >
        {item.name}
      </Text>
    </ListItem>
  );

  // async loginFacebook() {
  //     try {
  //       const {
  //         type,
  //         token,
  //         expires       
  //       } = await Expo.Facebook.logInWithReadPermissionsAsync('2341289862566899', {
  //         permissions: ['public_profile', 'user_photos', 'user_posts', 'publish_to_groups'],
  //       });
  //       if (type === 'success') {
  //         console.log('facebook token: ' + token);

  //         // get user info
  //         const responseBasicUser = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
  //         let user = await responseBasicUser.json();

  //         // store user credential(facebook id, name and token) into AsyncStorage
  //         var fbInformation = {
  //             id: user.id,
  //             name: user.name,
  //             token: token,
  //             expires: expires
  //         };
  //         this._storeData("UserFbInfo", JSON.stringify(fbInformation));

  //         this._retrieveData("UserFbInfo").then((value) => {
  //           console.log("fb stored value: " + value);
  //         });
          
  //         //TODO: call api server to create our user based on facebook user (id and name) and get our app token

  //         var postUser = {
  //           email: user.id,
  //           password: '123456',
  //           username: user.name,
  //           lastName: "",
  //           firstName: "",
  //           fullName: user.name,
  //           fbToken: token
  //           };
  //           this.loginDetails(postUser);
          
  //       } else {
  //         // type === 'cancel'
  //       }
  //     } catch (ex) {
  //       console.log(`Facebook Login Error: ` + ex);
  //     }
  // }

  // _storeData = async (key, value) => {
  //   try {
  //     await AsyncStorage.setItem(key, value);
  //   } catch (error) {
  //     // Error saving data
  //   }
  // }

    // _retrieveData = async (key) => {
  //   try {
  //     const value = await AsyncStorage.getItem(key);
  //     if (value !== null) {
  //       // We have data!!
  //       //console.log(value);
  //       return value;
  //     }
  //    } catch (error) {
  //      // Error retrieving data
  //    }
  // }

  loginFacebookSdk(error, result) {
    if (error) {
      console.log("login has error: " + result.error);
    } else if (result.isCancelled) {
      console.log("login is cancelled.");
    } else {
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          console.log(data.accessToken.toString());          
        }
      );
    }
  }

  requestPublishPermissions() {
    LoginManager.logInWithPublishPermissions(["publish_to_groups"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );
         
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  }

  loginLocal() {
    //demo call api to login and get token
        var postUser = {
            email: 'bbb',
            password: '123456'
        };
        this.loginDetails(postUser);
  }

  loginDetails(postUser) {
    var loginUser = {
      email: postUser.email,
      password: postUser.password
    };
    loginApi.post(`/login`, loginUser)
    .then(res => {
      // store token into Store
      console.log('token ' + res.data.token);
      const user: StoreData.UserVM = {
          username: "asdf",
          lastName: "asdf",
          firstName: "asdf",
          fullName: "adffff",
          email: postUser.email,
          token: res.data.token,
          fbToken: postUser.fbToken
      };
      this.props.addToken(user);         
      // set global token for all request to trip-api
      tripApi.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;   
      this.props.navigation.navigate("TripCreation");
    })
    .catch((error) => {
      console.log('error: ' + JSON.stringify(error));
    })       
  }

  shareLinkWithShareDialog() {
    var tmp = this;

    ShareDialog.canShow(this.state.shareLinkContent)
      .then(function(canShow) {
        if (canShow) {
          return ShareDialog.show(tmp.state.shareLinkContent);
        }
      })
      .then(
        function(result) {
          if (result.isCancelled) {
            console.log('Share cancelled');
          } else {
            console.log('Share success');
          }
        },
        function(error) {
          console.log('Share fail with error: ' + error);
        },
      );
  }

  sharePhotoWithShareDialog() {
    var tmp = this;

    ShareDialog.canShow(this.state.sharePhotoContent)
      .then(function(canShow) {
        if (canShow) {
          return ShareDialog.show(tmp.state.sharePhotoContent);
        }
      })
      .then(
        function(result) {
          if (result.isCancelled) {
            console.log('Share cancelled');
          } else {
            console.log('Share success');
          }
        },
        function(error) {
          console.log('Share fail with error: ' + error);
        },
      );
  }

  // async shareLinkOnGroupByGraphApi() {
  //   var groupId = 2140844709315900;
  //   var linkContent ={
  //     message: "Test: create post on group",
  //     link: 'https://www.facebook.com/'
  //   };

  //   AccessToken.getCurrentAccessToken().then(
  //     async (data) => {
  //       await fetch(`https://graph.facebook.com/${groupId}/feed_token=${data.accessToken}`, {
  //         method: 'POST',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(linkContent)
  //       }).then(response => {
  //         console.log("created link on group")
  //       }).catch(err => {
  //         console.log(err)
  //       });
  //     }
  //   );    
  // }

  // async sharePhotoOnGroupByGraphApi() {
  //   var groupId = 2140844709315900;
  //   let photo = { uri: 'file:///storage/emulated/0/Download/waiting-for-android-5a8833.jpg'};
  //   let formdata = new FormData();
  //   formdata.append("caption", 'test');
  //   formdata.append("source", { uri: photo.uri, name: 'image.jpg', type: 'multipart/form-data'} );

  //   AccessToken.getCurrentAccessToken().then(
  //     async (data) => {
  //       await fetch(`https://graph.facebook.com/${groupId}/photos_token=${token}`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //         body: formdata
  //       }).then(response => {
  //         console.log("image uploaded")
  //       }).catch(err => {
  //         console.log(err)
  //       });
  //     }
  //   );     
  // }

  render() {

    const { repos } = this.props;

    return (
      <Container>
        <Header />
        <Content>
            <View>
                {/* <Button
                  onPress={() => this.loginFacebook()}>                 
                  <Text>Login Facebook</Text> 
                </Button> */}
                <LoginButton         
                  readPermissions={['public_profile', 'user_photos', 'user_posts']}
                  onLoginFinished={
                    (error, result) => this.loginFacebookSdk(error, result)
                  }
                  onLogoutFinished={() => console.log("logout.")}/>
                <Button
                  onPress={() => this.requestPublishPermissions()}>                 
                  <Text>Request publish permissions on FB</Text> 
                </Button>
                <Button
                  onPress={() => this.shareLinkWithShareDialog()}>                 
                  <Text>Share Link on Facebook</Text> 
                </Button>
                <Button
                  onPress={() => this.sharePhotoWithShareDialog()}>                 
                  <Text>Share Photos on Facebook</Text> 
                </Button>
                {/* <Button
                  onPress={() => this.shareLinkOnGroupByGraphApi()}>                 
                  <Text>Share Link on Group of Facebook</Text> 
                </Button>
                <Button
                  onPress={() => this.sharePhotoOnGroupByGraphApi()}>                 
                  <Text>Share Photos on Group of Facebook</Text> 
                </Button> */}
                <Button
                  onPress={() => this.loginLocal()}>               
                  <Text>Login Local</Text> 
                </Button>
            </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical>
              <Icon active name="navigate" />
              <Text>Search</Text>
            </Button>
            <Button vertical
              onPress={() => this.props.navigation.navigate("TripCreation")}>
              <Icon type="FontAwesome" name="plus-circle" />
              <Text>Create</Text>
            </Button>

            <Button vertical active>
              <Icon name="person" />
              <Text>Profile</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  let storedRepositories = state.repo.repos.map(repo => ({ key: repo.id, ...repo }));
  return {
    repos: storedRepositories
  };
};

const mapDispatchToProps: IMapDispatchToProps = {
  listRepos,
  addToken
};

const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(Home);
export default HomeScreen;
// export default Home;
