import React from "react";
import { CameraRoll, Image } from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Text,
  ListItem,
  View
} from "native-base";
import { Footer } from "native-base";

import { connect, DispatchProp } from "react-redux";

import styles from "./styles";
import { listRepos } from "./reducer";
import * as RNa from "react-navigation";
import Loading from "../_components/Loading";
import { FileSystem } from "expo";
import {
  ShareDialog,
  LoginButton,
  AccessToken,
  LoginManager
} from "react-native-fbsdk";
import checkAndRequestPhotoPermissionAsync from "../shared/photo/PhotoPermission";
import {
  tripApi
} from "../_services/apis";
var RNFS = require('react-native-fs');
import { NavigationConstants } from "../_shared/ScreenConstants";
import { uploadSimpleImage } from "./actions";
import { ThunkDispatch } from "redux-thunk";
import { PropsBase } from "../_shared/LayoutContainer";
import AppFooter from "../shared/AppFooter";
import { loginUsingUserPass } from "../../store/User/operations";

export interface Props extends IMapDispatchToProps, DispatchProp, PropsBase {
  dispatch: ThunkDispatch<any, null, any>;
  navigation: RNa.NavigationScreenProp<any, any>;
  repos: Array<any>;
}

interface IMapDispatchToProps {
  listRepos: (name: string) => void;
  addInfographicUri: (tripId: string, path: string) => void
  uploadSimpleImage: (uri: string) => Promise<any>;
}

class Home extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    const shareLinkContent = {
      contentType: "link",
      contentUrl: "https://www.facebook.com/"
    };

    const photoUri01 =
        "file:///storage/emulated/0/DCIM/Camera/IMG_20181208_202705.jpg",
      photoUri02 =
        "file:///storage/emulated/0/DCIM/Camera/IMG_20181208_202700.jpg",
      photoUri03 =
        "file:///data/user/0/com.tripbff.android/files/test1.png";

    const sharePhotoContent = {
      contentType: "photo",
      photos: [
        { imageUrl: photoUri01 },
        { imageUrl: photoUri02 },
        { imageUrl: photoUri03 }
      ]
    };

    this.state = {
      shareLinkContent: shareLinkContent,
      sharePhotoContent: sharePhotoContent,
      imageUri: ""
    };
  }

  renderItem = ({ item }) => (
    <ListItem
      noIndent
      onPress={() =>
        this.props.navigation.navigate("TripDetail", { tripDetail: item.name })
      }
    >
      <Text style={styles.item}>{item.name}</Text>
    </ListItem>
  );

  loginFacebookSdk(error, result) {
    if (error) {
      console.log("login has error: " + result.error);
    } else if (result.isCancelled) {
      console.log("login is cancelled.");
    } else {
      AccessToken.getCurrentAccessToken().then(data => {
        console.log(data.accessToken.toString());
      });
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
      email: "aaa",
      password: "bbb"
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
            console.log("Share cancelled");
          } else {
            console.log("Share success");
          }
        },
        function(error) {
          console.log("Share fail with error: " + error);
        }
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
            console.log("Share cancelled");
          } else {
            console.log("Share success");
          }
        },
        function(error) {
          console.log("Share fail with error: " + error);
        }
      );
  }

  async uploadImage() {
    var postUser = {
      email: "bbb",
      password: "123456"
    };
    this.loginDetails(postUser.email, postUser.password, false).then(
      async () => {
        await checkAndRequestPhotoPermissionAsync();
        //content://media/external/images/media/2312
        // var u = "file:///storage/emulated/0/DCIM/Camera/20181106_082919.jpg";

        let photos = await CameraRoll.getPhotos({ first: 4 });
        var u = photos.edges[0].node.image.uri;
        // console.log(img);
        console.log(u);

        const info = await FileSystem.getInfoAsync(u);
        console.log(info);
        // const fileData = await FileSystem.readAsStringAsync(u);
        // console.log(fileData)
        this.props.uploadSimpleImage(u)
          .then(() => {
            console.log("uploaded");
          })
          .catch(err => {
            console.log("err");
            console.log(err);
          });
      }
    );
  }

  getImage() {
    tripApi
      .get(`/trips/infographics/1`)
      .then(res => {
        this.setState({imageUri: res.data});     
        
        var path = RNFS.DocumentDirectoryPath + '/test1.png';

        // write the file
        RNFS.writeFile(path, res.data, 'base64')
          .then(() => {
            console.log('FILE WRITTEN!');
            // store path of infographic into store
            this.props.addInfographicUri('1', path);

            // For demo: upload infographic to fb with local storage image
            const photoUri = "file://" + path;

            const sharePhotoContent = {
              contentType: "photo",
              photos: [
                { imageUrl: photoUri }
              ]
            };

            this.setState({sharePhotoContent: sharePhotoContent});
          })
          .catch((err) => {
            console.log(err.message);
          });          
      })
      .catch(error => {
        console.log("error: " + JSON.stringify(error));
      });
  }

  render() {
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
              readPermissions={["public_profile", "user_photos", "user_posts"]}
              onLoginFinished={(error, result) =>
                this.loginFacebookSdk(error, result)
              }
              onLogoutFinished={() => console.log("logout.")}
            />
            <Button style={{ margin: 5 }} onPress={() => this.requestPublishPermissions()}>
              <Text>Request publish permissions on FB</Text>
            </Button>
            <Button style={{ margin: 5 }} onPress={() => this.shareLinkWithShareDialog()}>
              <Text>Share Link on Facebook</Text>
            </Button>
            <Button style={{ margin: 5 }} onPress={() => this.sharePhotoWithShareDialog()}>
              <Text>Share Photos on Facebook</Text>
            </Button>
            <Button style={{ margin: 5 }} onPress={() => this.loginLocal()}>
              <Text>Login Local</Text>
            </Button>

            <Button style={{ margin: 5 }} onPress={() => this.uploadImage()}>
              <Text>upload image</Text>
            </Button>

            <Button style={{ margin: 5 }} onPress={() => this.getImage()}>
              <Text>Get Image from server</Text>
            </Button>

            <Image
                source={{
                  uri: 'data:image/png;base64,' + this.state.imageUri             
                }}
                style={{width: 400, height: 600}}
              />

            <Loading message="aaaaaasdad asd asd asd asda sdas da sdas dasd as" />
          </View>
        </Content>
        <Footer>
          <AppFooter navigation={this.props.navigation} activeScreen={NavigationConstants.Screens.Home} />
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  let storedRepositories = state.repo.repos.map(repo => ({
    key: repo.id,
    ...repo
  }));
  return {
    repos: storedRepositories
  };
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch, //todo remove this dispatch, and do something similar to the one below
    uploadSimpleImage: uri => dispatch(uploadSimpleImage(uri)),

    listRepos,
  };
}

const HomeScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
export default HomeScreen;
// export default Home;
