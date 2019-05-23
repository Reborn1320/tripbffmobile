import React, { PureComponent } from "react";
import {  Image, Dimensions, ActivityIndicator, StyleSheet } from "react-native";
import {
  Container,
  Content,
  Button,
  Text,
  View,
  Toast
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
import { TabView } from 'react-native-tab-view';
import ImageList, { calculateImageListWidth, N_ITEMS_PER_ROW } from "../../../_molecules/ImageList/ImageList";
import { ImageSelection } from "../../../_molecules/ImageList/ImageSelection";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { runPromiseSeries, calculateByPercentage } from "../../../_function/commonFunc";
import Loading from "../../../_atoms/Loading/Loading";
import ImageZoom from 'react-native-image-pan-zoom';

interface ImageProps {
  images: Array<StoreData.ImportImageVM>,
  updateSelectedImagesUrl: (imageUrls: Array<any>) => void
}

  class PreviewImages extends PureComponent<ImageProps, any> {
      constructor(props) {
        super(props);

        this.state = {
            images: []
        };
      }    

      componentDidMount() {
        if (this.props.images) {
          this.setState({ images: this.props.images });
          let selectedImageUrls = this.props.images.map(item => {
              return {
                imageId: item.imageId,
                externalUrl: item.externalUrl
              }
            }); 
          this.props.updateSelectedImagesUrl(selectedImageUrls); 
        }
      }

      private _handleSelect(img) {
        var newImages = this.state.images.map(item => item.imageId != img.imageId ? item : {
                                            ...item,
                                            isSelected: !img.isSelected
                                          });        
        let selectedImageUrls = newImages.filter(item => item.isSelected).map(item => {
          return {
            imageId: item.imageId,
            externalUrl: item.externalUrl
          }
        });    

        this.setState({images: newImages});
        this.props.updateSelectedImagesUrl(selectedImageUrls);  
      }

      private renderItem = (itemInfo: { item: any, index: number }) => {
        const img = itemInfo.item;
        const { itemWidth } = calculateImageListWidth();

        return (
            <ImageSelection
                key={itemInfo.index}
                imageUrl={img.thumbnailExternalUrl}
                width={itemWidth}
                isChecked={img.isSelected}
                isDisplayFavorited={img.isFavorite}

                isFirstItemInRow={itemInfo.index % N_ITEMS_PER_ROW == 0}
                isFirstRow={ itemInfo.index < N_ITEMS_PER_ROW }

                onPress={() => this._handleSelect(img)}
            />
        );
      }

      render() {
        return (
          <View>
            {
              this.state.images.length > 0 ?
                  <ImageList
                  items={this.state.images}
                  renderItem={this.renderItem}
              />
              : <ActivityIndicator size="small" color="#00ff00" />
            }
          </View>
        );
      } 
  }

  class PreviewInfographicComponent extends PureComponent<any, any> {
    constructor(props) {
      super(props);

      this.state = { 
        imageUri: ""
      };
    }    

    componentDidMount() {
      this._getInfographic();
    }   

    private _getInfographic = () => {
      console.log('tripId: ' + this.props.tripId);

        tripApi
        .get(`/trips/${this.props.tripId}/infographics/${this.props.infographicId}`)
        .then(res => {
            if (res.data) {
              this.setState({imageUri: res.data});     
            
              var path = RNFS.DocumentDirectoryPath + '/test1.png';
  
              // write the file
              RNFS.writeFile(path, res.data, 'base64')
              .then((success) => {
                  console.log('FILE WRITTEN!');
  
                  const photoUri = "file://" + path;
                  this.props.updateShareInfographicUrl(photoUri);
              })
              .catch((err) => {
                  console.log(err.message);
              });          
            }            
        })
        .catch(error => {
            console.log("error: " + JSON.stringify(error));
        });
    }

    render() {
      let { width, height } = Dimensions.get('window');
      let infoHeight = width < height ? calculateByPercentage(height, 90) : calculateByPercentage(height, 98);
      let barHeight = width < height ? calculateByPercentage(height, 10) : calculateByPercentage(height, 2);

      return (
          <View style={{                        
            width: width,
            height: infoHeight }}>
            <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={width}
                       imageHeight={infoHeight}>
                <Image
                  source={{
                    uri: 'data:image/png;base64,' + this.state.imageUri             
                  }}
                  resizeMode='contain'
                  style= {{
                    position: 'absolute',
                    top: -barHeight,
                    left: 0,
                    right: 0,
                    width: width,
                    height: infoHeight}}
                />  
            </ImageZoom>
              
          </View>
      );
    }
  }

  export interface Props extends IMapDispatchToProps, DispatchProp, PropsBase {
    dispatch: ThunkDispatch<any, null, any>;
    navigation: RNa.NavigationScreenProp<any, any>,
    tripId: string,
    infographicId: string,
    images: Array<StoreData.ImportImageVM>
  }
  
  interface IMapDispatchToProps {    
  }

  interface State {
    index: number,
    routes: any,
    infographicUrl: string
    selectedImages: Array<any>,
    displayLoading: boolean,
    firstRendered: boolean
  } 

  class InfographicPreview extends React.PureComponent<Props, State> {
    constructor(props) {
      super(props);

      this.state = {
        index: 0,
        routes: [
          { key: 'first', title: 'Infographic' },
          { key: 'second', title: 'Images' },
        ],
        infographicUrl: "",
        selectedImages: [],
        displayLoading: true,
        firstRendered: true
      }
    } 

    static navigationOptions = ({ navigation, navigationOptions }) => {
      return {
        title: '',
        headerRight: (
          <Button transparent style={{
            alignSelf: "stretch"
                }}
            onPress={navigation.getParam('_cancel')}>
            <Text style={{ color: "white" }}>Cancel</Text>
          </Button>
        ),
      };
    };

    componentDidMount() {      
      this.props.navigation.setParams({ _cancel: this._cancel });
    }

    private _updateShareInfographicUrl = (imageUrl) => {
      this.setState({infographicUrl: imageUrl, displayLoading: false});
    }

    private _updateSelectedImagesUrl = (selectedImages) => {     
      this.setState({selectedImages: selectedImages});
    }

    private _downloadExternalImage = async (fileName: any, url: any) => {
      var path = RNFS.DocumentDirectoryPath + '/' + fileName + '.png';
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

       if (this.state.selectedImages.length > 5) {
          Toast.show({
            text: "Please select maximum 5 most favoriate images to share!",
            buttonText: "Okay",
            type: "warning",
            position: "top",
            duration: 3000
          });
       }
       else {
        this.setState({displayLoading: true});
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
                        tmp._navigateToProfile();
                      }
                    },
                    function(error) {
                      Toast.show({
                        text: "Got error when share to Facebook. Please try again!",
                        buttonText: "Okay",
                        type: "danger",
                        duration: 3000
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
                  LoginManager.logInWithReadPermissions(["public_profile", "user_photos", "user_posts"]).then(
                    function(result) {
                      if (result.isCancelled) {
                        console.log("Login cancelled");
                      } else {
                        console.log(
                          "Login success with permissions: " +
                            result.grantedPermissions.toString()
                        );
                        tmp._sharePhotoWithShareDialog();
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

    private _cancel = () => {
      this._navigateToProfile();
    }

    private _navigateToProfile = () => {
      this.props.navigation.navigate(NavigationConstants.Screens.Profile)
    }

    render() {
        return (
          <Container>
            <Content>
              <View>             
                    <TabView
                      navigationState={this.state}
                      renderScene={({ route }) => {
                        switch (route.key) {
                          case 'first':
                            return <PreviewInfographicComponent tripId={this.props.tripId}
                                      infographicId={this.props.infographicId}
                                      updateShareInfographicUrl={this._updateShareInfographicUrl}>
                                  </PreviewInfographicComponent>;
                          case 'second':                            
                            return <PreviewImages images={this.props.images}
                                      updateSelectedImagesUrl={this._updateSelectedImagesUrl}>                              
                                  </PreviewImages>;
                          default:
                            return null;
                        }
                      }}
                      onIndexChange={index =>  {
                        let displayLoading = false;

                        if (index == 1 && this.state.firstRendered) {
                          Toast.show({
                            text: "Please select maximum 5 most favoriate images to share!",
                            buttonText: "Okay",
                            type: "success",
                            position: "top",
                            duration: 3000
                          });
                        }
                        else if (index == 0 && !this.state.infographicUrl) {
                          displayLoading = true;
                        }

                        this.setState({ index, firstRendered: false, displayLoading: displayLoading })
                      }}
                      initialLayout={{ width: Dimensions.get('window').width }}
                    />
              </View> 
              {
                this.state.displayLoading && 
                  <View style={styles.loading}>
                    <Loading message={'loading'}/> 
                  </View>
              }           
            </Content>    
            <ActionButton
                    buttonColor="blue"
                    position="center"
                    onPress={this._sharePhotoWithShareDialog}
                    renderIcon={() => 
                      <View style={{alignItems: "center"}}>
                          <Icon name="share" style={styles.actionButtonIcon} />
                          <Text style={{color: "white"}}>Share</Text>
                      </View>
                    }
                    >                    
                </ActionButton>        
          </Container>
        );
      }
}

  

  const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    const { tripId } = ownProps.navigation.state.params;
    console.log('tripId from params: ' + tripId);
    var trip = storeState.currentTrip;
    var images = [];

    storeState.currentTrip.dates.forEach(date => {
      date.locations.forEach(location => {
        images = images.concat(location.images.map(img => {
          return {
            ...img,
            isSelected: false
          }
        }));
      })
    });    
    
    return {
      tripId: tripId,
      infographicId: trip.infographicId,
      images: images
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

  const styles = StyleSheet.create({
    actionButtonIcon: {
      fontSize: 20,
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
    }
  });