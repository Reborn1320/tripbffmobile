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
  import { addInfographicUri } from '../../trip/export/actions';
  import {
    ShareDialog,
    LoginButton,
    AccessToken,
    LoginManager
  } from "react-native-fbsdk";

  export interface Props extends IMapDispatchToProps, DispatchProp, PropsBase {
    dispatch: ThunkDispatch<any, null, any>;
    navigation: RNa.NavigationScreenProp<any, any>
  }
  
  interface IMapDispatchToProps {
    addInfographicUri: (tripId: string, path: string) => void
  }

  class InfographicPreview extends React.Component<Props, any> {
    constructor(props) {
      super(props);

      const sharePhotoContent = {
        contentType: "photo",
        photos: []
      };

      this.state = {
        imageUri: "",
        sharePhotoContent: sharePhotoContent
      };
    }

    componentDidMount() {
        this.getInfographic();
    }

    getInfographic() {
        tripApi
        .get(`/trips/infographics/1`)
        .then(res => {
            this.setState({imageUri: res.data});     
            
            var path = RNFS.DocumentDirectoryPath + '/test1.png';

            // write the file
            RNFS.writeFile(path, res.data, 'base64')
            .then((success) => {
                console.log('FILE WRITTEN!');
                // store path of infographic into store
                this.props.addInfographicUri('1', path);

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

        //TODO: should check user login before
    
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

  
  function mapDispatchToProps(dispatch) {
    return {
      dispatch, //todo remove this dispatch, and do something similar to the one below
      addInfographicUri
    };
  }
  
  const InfographicPreviewScreen = connect(
    null,
    mapDispatchToProps
  )(InfographicPreview);
  export default InfographicPreviewScreen;