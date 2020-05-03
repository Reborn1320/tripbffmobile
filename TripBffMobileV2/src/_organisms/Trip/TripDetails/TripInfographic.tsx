import React, { PureComponent } from "react";
import { tripApi  } from "../../../screens/_services/apis";
import _, { } from "lodash";
import { getCancelToken } from "../../../_function/commonFunc";
import { View, ViewStyle, TextStyle, StyleSheet, Image, Dimensions, ImageStyle, TouchableHighlight } from "react-native";
import { mixins } from "../../../_utils";
import NBColor from "../../../theme/variables/commonColor.js";
import { Icon, Text, Button } from "native-base";
import { withNamespaces } from "react-i18next";
import Flurry from 'react-native-flurry-sdk';
import { NavigationConstants } from "../../../screens/_shared/ScreenConstants";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";

var RNFS = require('react-native-fs');

export interface Props extends PropsBase {
  tripId: string,
  infographicExternalId: string;
}

class TripInfographicComponent extends PureComponent<Props, any> {

    _cancelRequest;
    _cancelToken;

    constructor(props) {
      super(props);

      this.state = { 
        imageUri: "",
        hasInfographic: this.props.infographicExternalId
      };
    }   

    componentDidMount() {
      Flurry.logEvent('Trip Infographic');
      let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
      this._cancelToken = cancelToken;
      this._cancelRequest = cancelRequest;

      if (this.props.infographicExternalId) {
        this._getInfographic();
      }
    }     

    componentDidUpdate(prevProps) {      
      if (this.props.infographicExternalId && prevProps.infographicExternalId != this.props.infographicExternalId)
        this._getInfographic();
    }

    componentWillUnmount() {
      this._cancelRequest('Operation canceled by the user.');
    }

    private _getInfographic = async () => {
        tripApi
        .get(`/trips/${this.props.tripId}/infographics/${this.props.infographicExternalId}/view`, {
          cancelToken: this._cancelToken
        })
        .then(res => {
          var signedUrl = res.request.responseURL;
          //console.log("signedUrl", signedUrl);        
          const tripFolderPath = RNFS.DocumentDirectoryPath + `/${this.props.tripId}`;

          RNFS.mkdir(tripFolderPath)
          .then(async () => {
            var path = RNFS.DocumentDirectoryPath + `/${this.props.tripId}/${this.props.infographicExternalId}.png`;

            return RNFS.downloadFile({
              fromUrl: signedUrl,
              toFile: path
            }).promise.then(response => {
              //console.log("download infographic image done!", path);
              //console.log("response download file", response);
              const photoUri = "file://" + path;
              //console.log("photoUri", photoUri);
              this.setState({ imageUri: photoUri, hasInfographic: !photoUri});   
            }).catch((error) => {
                console.log('download infographic image failed.: ' + JSON.stringify(error));
            });
          })
          .catch((err) => {
            console.log(err.message, err.code);
            throw err;
          }); 
        })
        .catch(error => {            
            console.log("error: " + JSON.stringify(error));
        });
    }

    private _viewAllPhotos = () => {
      this.props.navigation.navigate(NavigationConstants.Screens.TripAllPhotos, {
        tripId: this.props.tripId,
        canContribute: false
      });
    }

    private _viewInfographic = () => {
      this.props.navigation.navigate(NavigationConstants.Screens.TripInfograhicImage, {
        photoUri: this.state.imageUri
      });
    }

    render() {  
      const { t } = this.props;

      return (           
        this.state.imageUri ?        
        <View>
          <TouchableHighlight onPress={this._viewInfographic}>
            <Image        
              style={styles.infographic}
              resizeMode='contain'
              source={{
                uri: this.state.imageUri,
              }}
            /> 
          </TouchableHighlight>          
          <Button iconLeft light 
              style={styles.button} 
              onPress={this._viewAllPhotos}>
            <Icon name='md-images' type="Ionicons" />
            <Text style={styles.buttonTitle}>{t("action:viewAllPhotos")}</Text>
          </Button>
        </View>
        :
        (!this.state.hasInfographic ?           
          <View style={styles.container}>
            <View style={styles.emptyMsgContainer}>
                <Text numberOfLines={2} style={styles.emptyMsg}>
                  <Icon name="md-alert" type="Ionicons" style={styles.warningMsgIcon}></Icon>
                    {t("message:no_infographic")}
                </Text>
            </View>
          </View>
          : 
          <View>            
          </View>)
      );
    }
  }

export default withNamespaces(['message, action'])(TripInfographicComponent);

interface Style {
  container: ViewStyle;
  infographic: ImageStyle;
  emptyMsgContainer: ViewStyle;
  emptyMsg: TextStyle;
  warningMsgIcon: TextStyle;
  button: ViewStyle;
  buttonTitle: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  infographic: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
    marginTop: 12
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
  },
  warningMsgIcon: {
      fontSize: 18,
      color: NBColor.brandWarning,
      marginRight: 10
  },
  button: {
    marginTop: 20,
    marginLeft: 10
  },
  buttonTitle: {
    ...mixins.themes.fontSemiBold,
    textTransform: "capitalize",
    fontSize: 17,
    lineHeight: 22,
  },
})