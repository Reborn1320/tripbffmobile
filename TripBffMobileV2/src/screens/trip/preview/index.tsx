import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { AndroidBackHandler } from "react-navigation-backhandler";
import {
  Container,
  Content,
  Button,
  Text,
  View,
  Toast,
  Root,
  Icon
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
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import { TabView, TabBar } from 'react-native-tab-view';
import ActionButton from 'react-native-action-button';
import { runPromiseSeries, deleteFilesInFolder, getCancelToken } from "../../../_function/commonFunc";
import Loading from "../../../_atoms/Loading/Loading";
import { addInfographicId, addExternalInfographicId } from "../../../store/Trip/actions";
import PreviewInfographicComponent from "./PreviewInfographic";
import PreviewImages from "./PreviewImage";
import NBTheme from "../../../theme/variables/commonColor.js";
import { fetchTrip, updateInfographicStatus } from "../../../store/Trip/operations";
import { loginUsingFacebookAccessToken } from "../../../store/User/operations";
import { mixins } from "../../../_utils";
import TabBarComponent from "../../../_atoms/TabBar";
import { withNamespaces } from "react-i18next";
import axios from "axios";
import Flurry from 'react-native-flurry-sdk';

export interface Props extends IMapDispatchToProps, DispatchProp, PropsBase {
  dispatch: ThunkDispatch<any, null, any>;
  navigation: RNa.NavigationScreenProp<any, any>,
  tripId: string,
  infographicId: string,
  images: Array<StoreData.ImportImageVM>,
  isExistedCurrentTrip: boolean,
  userId: string,
  numberOfLocations: number,
  locale: string
}

interface IMapDispatchToProps {    
  addInfographicId: (tripId: string, infographicId: string) => void;
  fetchTrip: (tripId: string, cancelToken: any, createdById: string) => Promise<StoreData.TripVM>;
  loginUsingFacebookAccessToken: (userId, accessToken, loggedUserId, facebookUserEmail) => Promise<void>;
  updateInfographicStatus: (tripId: string, infographicId: string) => void;
  addExternalInfographicId: (tripId: string, externalId: string) => void;
}

interface State {
  index: number,
  routes: any,
  infographicUrl: string
  selectedImages: Array<any>,
  displayLoading: boolean,
  loadingMessage: string,
  firstRendered: boolean,
  isLoggedSocial: boolean,
  isLoadedInfographic: boolean
} 

class InfographicPreview extends React.PureComponent<Props & PropsBase, State> {

  _cancelRequest;

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: this.props.t("export:infographic_tab_label") },
        { key: 'second', title: this.props.t("export:images_tab_label") },
      ],
      infographicUrl: "",
      selectedImages: [],
      displayLoading: !this.props.isExistedCurrentTrip || this.props.numberOfLocations > 0,
      firstRendered: true,
      isLoggedSocial: false,
      loadingMessage: this.props.t("export:loading_infographic"),
      isLoadedInfographic: false
    }
  } 

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: screenProps.t("export:title"),
      headerLeft:  (
        <RNa.HeaderBackButton   
           tintColor={NBTheme.colorBackBlack}
           onPress={navigation.getParam('_handleBackPress')}
         />),
      headerRight: (
       <View></View>
      ),
    };
  };

  componentDidMount() {
    Flurry.logEvent('Export Infographic', null, true);
    Flurry.endTimedEvent('Trip Creation - Export Infographic');
    
    this.props.navigation.setParams({ _handleBackPress: this._handleBackPress });

    let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
    this._cancelRequest = cancelRequest;
    
    let tripId = this.props.tripId;
    let userId = this.props.userId;

    if(!this.props.isExistedCurrentTrip) {
      this.props.fetchTrip(tripId, cancelToken, userId).then((trip: StoreData.TripVM) => {
          var numberOfLocations = trip.rawLocations ? trip.rawLocations.length : 0;

          if(numberOfLocations > 0) 
            this._createInfographic(tripId);
          else 
            this.setState({displayLoading: false});
      });
    }
    else if (this.props.numberOfLocations > 0)
    {
      this._createInfographic(tripId);  
    }
  }

  componentWillUnmount() {
    this._cancelRequest('Operation canceled by the user.');
    deleteFilesInFolder(`${this.props.tripId}`);
    Flurry.endTimedEvent('Export Infographic');
  }

  private _handleBackPress = () => {
    let isFromProfile = this.props.navigation.getParam("isFromProfile");

    if (isFromProfile)
      this._navigateToProfile();      
    else 
      this.props.navigation.goBack();
      
    return true;
  }

  private _createInfographic = (tripId) => {
      tripApi
      .post('/trips/' + tripId + '/infographics', { locale: this.props.locale })
      .then(res => {
          var infographicId = res.data;
          console.log('infographic id: ' + infographicId);    
          this.props.addInfographicId(tripId, infographicId);           
      })
      .catch(error => {
          console.log("error: " + JSON.stringify(error));
      });
  }

  private _updateShareInfographicUrl = (imageUrl) => {
    this.setState({infographicUrl: imageUrl, displayLoading: false, isLoadedInfographic: true});
  }

  private _updateSelectedImagesUrl = (selectedImages) => {     
    this.setState({selectedImages: selectedImages});
  }

  private _downloadExternalImage = async (fileName: any, url: any) => {
    var path = RNFS.DocumentDirectoryPath + `/${this.props.tripId}/${fileName}.png`;
    return RNFS.downloadFile({
      fromUrl: url,
      toFile: path
    }).promise.then(response => {
        const photoUri = "file://" + path;
        return photoUri;
    }).catch((error) => {
        console.log('download images failed.: ' + JSON.stringify(error));
    });
  }

  private _storeExternalImageIntoLocalStorage = async (externalImages: Array<any>) => {
    let localImageUris = [];

    if (externalImages && externalImages.length > 0) {
      let imageFuncs = [],
          tmp = this;

      _.each(externalImages, img => {
          let func = function() {                
              return tmp._downloadExternalImage(img.imageId, img.externalUrl).then((photoUri) => {
                if (photoUri) localImageUris.push(photoUri);
              });
          }
          
          imageFuncs.push(func);
      }) 

      return runPromiseSeries(imageFuncs).then(results => {
        return localImageUris;
    }); 
    }

    return localImageUris;
  }

  private _sharePhotoWithShareDialog = async () => {
      var tmp = this;  
      if (this.props.infographicId) {
        if (this.state.selectedImages.length > 5) {
          Toast.show({
            text: this.props.t("export:images_selection_warning"),
            buttonText: "Okay",
            textStyle: {
              ...mixins.themes.fontNormal
            },
            buttonTextStyle: {
              ...mixins.themes.fontNormal
            },
            type: "warning",
            position: "top",
            duration: 5000
          });
        }
        else {
          this.setState({displayLoading: true, loadingMessage: ""});        
  
          let localImageUris = await this._storeExternalImageIntoLocalStorage(this.state.selectedImages); 
          let imageUrls = [this.state.infographicUrl].concat(localImageUris);        
  
          console.log('final selected image url: ' + JSON.stringify(imageUrls));
          let photos = imageUrls.map(item => {
            return {  imageUrl: item }
          });
  
          const sharePhotoContent = {
            contentType: "photo",
            photos: photos
          } as any;
  
          AccessToken.getCurrentAccessToken().then(
              (data) => {
                if (data) {
                  try{
                    ShareDialog.canShow(sharePhotoContent)
                    .then(function(canShow) {
                      tmp.setState({displayLoading: false});
  
                      if (canShow) {
                        return ShareDialog.show(sharePhotoContent)                    
                      }                    
                    })
                    .then(
                      function(result) {
                        console.log("Share result: " + JSON.stringify(result));
                        if (result.isCancelled) {
                          console.log("Share cancelled");
                        } else {
                          console.log("Share success");
                          Flurry.logEvent('Shared Infographic');
                          //update status of infographic to Shared
                          tmp.props.updateInfographicStatus(tmp.props.tripId, tmp.props.infographicId);
                          tmp._navigateToProfile();
                        }
                      },
                      function(error) {
                        Toast.show({
                          text: "Got error when share to Facebook. Please try again!",
                          buttonText: "Okay",
                          textStyle: {
                            ...mixins.themes.fontNormal
                          },
                          buttonTextStyle: {
                            ...mixins.themes.fontNormal
                          },
                          type: "danger",
                          duration: 5000
                        });
                        console.log("Share fail with error: " + error);
                      }
                    );
                  }
                  catch(error) {
                      console.log('come here error try catch');
                  }
                  
                }
                else {
                    console.log('need to log-in');
                    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
                      function(result) {
                        if (result.isCancelled) {
                          console.log("Login cancelled");
                        } else {                      
                          console.log(
                            "Login success with permissions: " + JSON.stringify(result)
                          );
                          // call api to login with FB
                          AccessToken.getCurrentAccessToken().then(data => {  
                            //get user info
                            let uri = "https://graph.facebook.com/" + data.userID + "?fields=email&access_token=" + data.accessToken;
                            
                            axios.get(uri)
                                .then(value => {
                                  return value.data.email;
                                },
                                (error) => {
                                  return "";
                                })
                                .then((email) => {
                                  tmp.props.loginUsingFacebookAccessToken(data.userID, data.accessToken, tmp.props.userId, email);
                                })                            
                          });

                          tmp._sharePhotoWithShareDialog();
                          tmp.setState({ isLoggedSocial: true });
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
      }
      else {
        Toast.show({
          text: this.props.t("export:nothing_to_share_message"),
          buttonText: "Okay",
          textStyle: {
            ...mixins.themes.fontNormal
          },
          buttonTextStyle: {
            ...mixins.themes.fontNormal
          },
          position: "bottom",
          duration: 5000
        });
      }
  }

  private _renderTabBar = (props) => {
    return (
      <TabBarComponent tabProps={props}></TabBarComponent>
    )
  }

  private _navigateToProfile = () => {
    let onGoBackCallBack = this.props.navigation.getParam("onGoBackProfile");
    let isFromProfile = this.props.navigation.getParam("isFromProfile");
    let { isLoggedSocial } = this.state;

    if (onGoBackCallBack && (isFromProfile && isLoggedSocial || !isFromProfile))
      onGoBackCallBack();

    this.props.navigation.navigate(NavigationConstants.Screens.Profile);
  }

  render() {
    let { numberOfLocations, isExistedCurrentTrip, t } = this.props;
    let isDisplayEmptyMessage = numberOfLocations == 0 && isExistedCurrentTrip;

    var previewInfographicElement = 
          isDisplayEmptyMessage ?
          (
            <View style={styles.emptyMsgcontainer}>
              <View style={styles.emptyMsgContainer}>
                  <Text numberOfLines={2} style={styles.emptyMsg}>
                      {t("export:no_infographic")}
                  </Text>
              </View>
            </View>
          ) :  
          (
            this.state.isLoadedInfographic && !this.state.infographicUrl
            ?
              <View style={styles.emptyMsgcontainer}>
                <View style={styles.emptyMsgContainer}>
                    <Text numberOfLines={2} style={styles.emptyMsg}>
                        {t("export:error_message_infographic")}
                    </Text>
                </View>
              </View>
            :
              <PreviewInfographicComponent tripId={this.props.tripId}
                  infographicId={this.props.infographicId}
                  addExternalInfographicId={this.props.addExternalInfographicId}
                  updateShareInfographicUrl={this._updateShareInfographicUrl}>
              </PreviewInfographicComponent> 
          ) 

      return (
        <View style={styles.container}>
            <AndroidBackHandler onBackPress={this._handleBackPress} />
            <View style={styles.tabViewContainer}>
                <Root>             
                  <TabView
                    navigationState={this.state}
                    renderTabBar={this._renderTabBar}
                    renderScene={({ route }) => {
                      switch (route.key) {
                        case 'first':
                          return previewInfographicElement;
                        case 'second':                            
                          return <PreviewImages images={this.props.images}
                                    isExistedCurrentTrip={this.props.isExistedCurrentTrip}
                                    updateSelectedImagesUrl={this._updateSelectedImagesUrl}>                              
                                </PreviewImages>;
                        default:
                          return null;
                      }
                    }}
                    onIndexChange={index =>  {
                      let displayLoading = false;

                      if (index == 1 && this.state.firstRendered && this.props.images.length > 0) {
                        Toast.show({
                          text: t("export:images_selection_warning"),
                          buttonText: "Okay",
                          textStyle: {
                            ...mixins.themes.fontNormal
                          },
                          buttonTextStyle: {
                            ...mixins.themes.fontNormal
                          },
                          type: "success",
                          position: "top",
                          duration: 5000
                        });
                      }
                      else if (index == 0 && !this.state.isLoadedInfographic && !isDisplayEmptyMessage) {
                        displayLoading = true;
                      }

                      this.setState({ index, firstRendered: false, displayLoading: displayLoading })
                    }}
                    initialLayout={{ width: Dimensions.get('window').width }}
                  />
              </Root>
            </View> 
            {
              this.state.displayLoading && 
                <View style={styles.loading}>
                  <Loading message={this.state.loadingMessage}/> 
                </View>
            }           
  
              <ActionButton
                  buttonColor={'#3D5A96'}
                  position="center"
                  onPress={this._sharePhotoWithShareDialog}
                  renderIcon={() => 
                    <View style={{alignItems: "center"}}>
                        <Icon name="facebook-f" type="FontAwesome" style={styles.actionButtonIcon} />
                    </View>
                  }
                  >                    
              </ActionButton>        
        </View>
      );
    }
}  

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  const { tripId } = ownProps.navigation.state.params;    
  var trip = storeState.currentTrip;
  var images = [];
  var isExistedCurrentTrip = false;
  var numberOfLocations = 0;

  if (trip && trip.tripId == tripId) {
    isExistedCurrentTrip = true;
    
    trip.dates.forEach(date => {
      numberOfLocations += date.locations.length;

      date.locations.forEach(location => {        
        images = images.concat(location.images.map(img => {
          return {
            ...img,
            isSelected: false
          }
        }));
      })
    });    
  }  
  
  return {
    userId: storeState.user.id,
    tripId: tripId,
    numberOfLocations: numberOfLocations,
    infographicId: trip ? trip.infographicId : "",
    images: images,
    isExistedCurrentTrip: isExistedCurrentTrip,
    locale: storeState.user.locale
  };
};

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
  return {
    addInfographicId: (tripId, infographicId) => dispatch(addInfographicId(tripId, infographicId)),
    fetchTrip: (tripId, cancelToken, createdById) => dispatch(fetchTrip(tripId, cancelToken, createdById)),
    loginUsingFacebookAccessToken: (userId, accessToken, loggedUserId, facebookUserEmail) => dispatch(loginUsingFacebookAccessToken(userId, accessToken, loggedUserId, facebookUserEmail)),
    updateInfographicStatus: (tripId, infographicId) => dispatch(updateInfographicStatus(tripId, infographicId)),
    addExternalInfographicId: (tripId, externalId) => dispatch(addExternalInfographicId(tripId, externalId)),
  };
};

const InfographicPreviewScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(InfographicPreview);
export default withNamespaces(['export', 'action'])(InfographicPreviewScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabViewContainer: {
    flex: 1
  },
  actionButtonIcon: {
    fontSize: 28,
    height: 22,
    color: 'white',
  },
  loading: {  
    position: "absolute",
    top: Dimensions.get('window').height / 3,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center'
  },
  emptyMsgcontainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  emptyMsgContainer: {
      maxWidth: "80%",
      marginTop: "20%",
      height: 120
  },
  emptyMsg: {
      ...mixins.themes.fontNormal,
      fontSize: 18,
      textAlign: "center",
      color: "#383838"
  }
});
