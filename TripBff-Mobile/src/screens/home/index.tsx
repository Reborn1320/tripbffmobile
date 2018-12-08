import React from "react";
import { FlatList, CameraRoll } from "react-native";
import { Container, Header, Content, Button, Icon, Text, ListItem, View } from 'native-base';
import { Footer, FooterTab } from 'native-base';

import { connect, DispatchProp } from 'react-redux';

import styles from "./styles";
import { listRepos } from './reducer';
import * as RNa from "react-navigation";
import Loading from "../_components/Loading";
import Expo, { FileSystem, MediaLibrary } from "expo";
import loginApi from '../apiBase/loginApi';
import tripApi from '../apiBase/tripApi';
import { StoreData } from "../../Interfaces";
import { addToken } from '../auth/actions';
import { AsyncStorage } from "react-native";
import { ShareDialog } from 'react-native-fbsdk'
import checkAndRequestPhotoPermissionAsync from "../shared/photo/PhotoPermission";
import { uploadImageAsync } from "../_services/BlobUploader";

export interface Props extends IMapDispatchToProps, DispatchProp {
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

  async componentDidMount() {
    await checkAndRequestPhotoPermissionAsync();
    //content://media/external/images/media/2312
    // var u = "file:///storage/emulated/0/DCIM/Camera/20181106_082919.jpg";

    let photos = await CameraRoll.getPhotos({ first: 4 });
    var img = photos.edges[0].node.image
    var u = photos.edges[0].node.image.uri
    // console.log(img);
    console.log(u);

    const info = await FileSystem.getInfoAsync(u);
    console.log(info)
    // const fileData = await FileSystem.readAsStringAsync(u);
    // console.log(fileData)
    uploadImageAsync("/uploadImage", u)
    .then(() => {
      console.log("uploaded");
    })
    .catch((err) => {
      console.log(err);
      
    })
    // //does not fucking work, curse u expo sdk
    // const mediaType = MediaLibrary.MediaType.photo
    // const result = await MediaLibrary.getAssetsAsync({
    //   first: 4,
    //   mediaType: mediaType,
    //   sortBy: MediaLibrary.SortBy.creationTime,
    // })    
    // console.log(result.assets[0].uri);
    // const u = result.assets[0].uri;
    // uploadImageAsync("/uploadImage", u)
    // .then(() => {
    //   console.log("uploaded");
    // })
    // .catch((err) => {
    //   console.log(err);
    // })
  }

  // async uploadImageAsync(uri) {
  //   const blob = await new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.responseType = 'blob'; // use BlobModule's UriHandler
  //     xhr.onload = function() {
  //       console.log("onload")
  //       console.log(xhr.response);
  //       resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
  //    };
  //    xhr.onerror = function() {
  //      console.log(arguments);
  //      reject(new TypeError('Network request failed')); // error occurred, rejecting
  //    };
  //    xhr.open('GET', uri, true); // fetch the blob from uri in async mode
  //    xhr.send(null); // no initial data
  //  });
  
  //   // when we're done sending it, close and release the blob
  //   // blob.close();
  
  //   // return the result, eg. remote URI to the image
  //   // return remoteUri;
  // }

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

  async loginFacebook() {
      try {
        const {
          type,
          token,
          expires       
        } = await Expo.Facebook.logInWithReadPermissionsAsync('2341289862566899', {
          permissions: ['public_profile', 'user_photos', 'user_posts'],
        });
        if (type === 'success') {
          console.log('facebook token: ' + token);

          // get user info
          const responseBasicUser = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
          let user = await responseBasicUser.json();

          // store user credential(facebook id, name and token) into AsyncStorage
          var fbInformation = {
              id: user.id,
              name: user.name,
              token: token,
              expires: expires
          };
          this._storeData("UserFbInfo", JSON.stringify(fbInformation));

          this._retrieveData("UserFbInfo").then((value) => {
            console.log("fb stored value: " + value);
          });
          
          //TODO: call api server to create our user based on facebook user (id and name) and get our app token

          var postUser = {
            email: user.id,
            password: '123456',
            username: user.name,
            lastName: "",
            firstName: "",
            fullName: user.name,
            fbToken: token
            };
            this.loginDetails(postUser);
          
        } else {
          // type === 'cancel'
        }
      } catch ({ message }) {
        alert(`Facebook Login Error: ${message}`);
      }
  }

  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  }

  _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        //console.log(value);
        return value;
      }
     } catch (error) {
       // Error retrieving data
     }
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

  render() {

    const { repos } = this.props;

    return (
      <Container>
        <Header />
        <Content>
            <View>
                <Button
                  onPress={() => this.loginFacebook()}>                 
                  <Text>Login Facebook</Text> 
                </Button>
                <Button
                  onPress={() => this.shareLinkWithShareDialog()}>                 
                  <Text>Share Link on Facebook</Text> 
                </Button>
                <Button
                  onPress={() => this.sharePhotoWithShareDialog()}>                 
                  <Text>Share Photos on Facebook</Text> 
                </Button>
                <Button
                  onPress={() => this.loginLocal()}>               
                  <Text>Login Local</Text> 
                </Button>
                <Loading message="aaaaaasdad asd asd asd asda sdas da sdas dasd as" />
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
