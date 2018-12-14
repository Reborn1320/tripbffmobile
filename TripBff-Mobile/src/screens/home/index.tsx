import React from "react";
import { CameraRoll } from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Text,
  ListItem,
  View
} from "native-base";
import { Footer, FooterTab } from "native-base";

import { connect, DispatchProp } from "react-redux";

import styles from "./styles";
import { listRepos } from "./reducer";
import * as RNa from "react-navigation";
import Loading from "../_components/Loading";
import { FileSystem } from "expo";
import { StoreData } from "../../Interfaces";
import { addToken } from "../auth/actions";
import {
  ShareDialog,
  LoginButton,
  AccessToken,
  LoginManager
} from "react-native-fbsdk";
import checkAndRequestPhotoPermissionAsync from "../shared/photo/PhotoPermission";
import {
  loginApi,
  setAuthorizationHeader,
  uploadFileApi
} from "../_services/apis";

export interface Props extends IMapDispatchToProps, DispatchProp {
  navigation: RNa.NavigationScreenProp<any, any>;
  repos: Array<any>;
}

interface IMapDispatchToProps {
  listRepos: (name: string) => void;
  addToken: (user: StoreData.UserVM) => void;
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
        "file:///storage/emulated/0/DCIM/Camera/IMG_20181208_203212.jpg";

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
      sharePhotoContent: sharePhotoContent
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
      email: "bbb",
      password: "123456"
    };
    this.loginDetails(postUser);
  }

  loginDetails(postUser, isMoveToCreate = true) {
    var loginUser = {
      email: postUser.email,
      password: postUser.password
    };
    return loginApi
      .post(`/login`, loginUser)
      .then(res => {
        // store token into Store
        console.log("token " + res.data.token);
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
        setAuthorizationHeader(res.data.token);
        if (isMoveToCreate) {
          this.props.navigation.navigate("TripCreation");
        }
      })
      .catch(error => {
        console.log("error: " + JSON.stringify(error));
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
    this.loginDetails(postUser, false).then(async () => {
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
      uploadFileApi
        .upload("/uploadImage", u, { fileName: "image.jpg" })
        .then(() => {
          console.log("uploaded");
          console.log(arguments);
        })
        .catch(err => {
          console.log("err");
          console.log(err);
        });
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
            <Button onPress={() => this.requestPublishPermissions()}>
              <Text>Request publish permissions on FB</Text>
            </Button>
            <Button onPress={() => this.shareLinkWithShareDialog()}>
              <Text>Share Link on Facebook</Text>
            </Button>
            <Button onPress={() => this.sharePhotoWithShareDialog()}>
              <Text>Share Photos on Facebook</Text>
            </Button>
            <Button onPress={() => this.loginLocal()}>
              <Text>Login Local</Text>
            </Button>

            <Button onPress={() => this.uploadImage()}>
              <Text>upload image</Text>
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
            <Button
              vertical
              onPress={() => this.props.navigation.navigate("TripCreation")}
            >
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
  let storedRepositories = state.repo.repos.map(repo => ({
    key: repo.id,
    ...repo
  }));
  return {
    repos: storedRepositories
  };
};

const mapDispatchToProps: IMapDispatchToProps = {
  listRepos,
  addToken
};

const HomeScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
export default HomeScreen;
// export default Home;
