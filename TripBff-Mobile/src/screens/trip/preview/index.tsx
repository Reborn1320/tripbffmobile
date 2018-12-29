import React from "react";
import {  Image } from "react-native";
import {
    Container,
    Header,
    Content,
    Button,
    Icon,
    Text,
    View
  } from "native-base";
  import { ThunkDispatch } from "redux-thunk";
  import { PropsBase } from "../../_shared/LayoutContainer";
  import * as RNa from "react-navigation";
  import { connect, DispatchProp } from "react-redux";
  import { tripApi  } from "../../_services/apis";
  var RNFS = require('react-native-fs');
  import {
    ShareDialog,    
    AccessToken,
    LoginManager
  } from "react-native-fbsdk";
  import { StoreData } from "../../../Interfaces";
  import _, { } from "lodash";
  import { NavigationConstants } from "../../_shared/ScreenConstants";

  export interface Props extends IMapDispatchToProps, DispatchProp, PropsBase {
    dispatch: ThunkDispatch<any, null, any>;
    navigation: RNa.NavigationScreenProp<any, any>
  }
  
  interface IMapDispatchToProps {
    
  }

  interface State {
    tripId: string,
    infographicId: string,
    isLoaded: boolean,
    imageUri: string,
    sharePhotoContent: any
  } 

  class InfographicPreview extends React.Component<Props, State> {
    constructor(props) {
      super(props);

      const sharePhotoContent = {
        contentType: "photo",
        photos: []
      };

      this.state = {
            tripId: props.trip.id,    
            infographicId: props.trip.infographicId,      
            isLoaded: false,
            imageUri: "",
            sharePhotoContent: sharePhotoContent
      };
    }

    componentDidMount() {
        this.getInfographic();
    }

    getInfographic() {
        tripApi
        .get(`/trips/${this.state.tripId}/infographics/${this.state.infographicId}`)
        .then(res => {
            this.setState({imageUri: res.data});     
            
            var path = RNFS.DocumentDirectoryPath + '/test1.png';

            // write the file
            RNFS.writeFile(path, res.data, 'base64')
            .then((success) => {
                console.log('FILE WRITTEN!');

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

    sharePhotoWithShareDialog() {
        var tmp = this;

        AccessToken.getCurrentAccessToken().then(
            (data) => {
              if (data) {
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
              else {
                  console.log('need to log-in');
                  LoginManager.logInWithReadPermissions(["public_profile", "user_photos", "user_posts"]).then(
                    function(result) {
                      if (result.isCancelled) {
                        console.log("Login cancelled");
                      } else {
                        console.log(
                          "Login success with permissions: " +
                            result.grantedPermissions.toString()
                        );
                        tmp.sharePhotoWithShareDialog();
                      }
                    },
                    function(error) {
                      console.log("Login fail with error: " + error);
                    }
                  );
              }
            } 
        );    
      }

    render() {
        return (
          <Container>
            <Header />
            <Content>
              <View>             
                  <Button style={{ margin: 10 }}
                    onPress={() => this.sharePhotoWithShareDialog()}>
                     <Text> Share on Facebook</Text>
                  </Button>
                <Text style={{ margin: 10 }}>Preview infographic:</Text>
                <Image
                    source={{
                      uri: 'data:image/png;base64,' + this.state.imageUri             
                    }}
                    style={{width: 400, height: 600}}
                  />  

              </View>
            </Content>            
          </Container>
        );
      }
}

  

  const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    const { tripId } = ownProps.navigation.state.params;
    var trip = _.find(storeState.trips, (item) => item.id == tripId)
    return {
        trip
    };
  };

  function mapDispatchToProps(dispatch) {
    return {
      dispatch, //todo remove this dispatch, and do something similar to the one below      
    };
  }
  
  const InfographicPreviewScreen = connect(
    mapStateToProps,
    mapDispatchToProps
  )(InfographicPreview);
  export default InfographicPreviewScreen;