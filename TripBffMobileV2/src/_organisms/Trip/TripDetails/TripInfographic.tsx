import React, { PureComponent } from "react";
import { tripApi  } from "../../../screens/_services/apis";
import _, { } from "lodash";
import { getCancelToken } from "../../../_function/commonFunc";
import Gallery from 'react-native-image-gallery';
import { View, ViewStyle, TextStyle, StyleSheet, Image, Dimensions, ImageStyle } from "react-native";
import { mixins } from "../../../_utils";
import NBColor from "../../../theme/variables/commonColor.js";
import { Icon, Text, Button } from "native-base";
import { withNamespaces } from "react-i18next";
import Flurry from 'react-native-flurry-sdk';
import { NavigationConstants } from "../../../screens/_shared/ScreenConstants";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";

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
      Flurry.logEvent('Trip Infographic', null, true);
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
      Flurry.endTimedEvent('Trip Infographic');
      this._cancelRequest('Operation canceled by the user.');
    }

    private _getInfographic = async () => {
        tripApi
        .get(`/trips/${this.props.tripId}/infographics/${this.props.infographicExternalId}/view`, {
          cancelToken: this._cancelToken
        })
        .then(res => {
          var signedUrl = res.request.responseURL;
          console.log("signedUrl", signedUrl);          
          this.setState({ imageUri: signedUrl, hasInfographic: !signedUrl });     
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

    render() {  
      const { t } = this.props;
      console.log('trip infographic re-rendered: ' + this.state.hasInfographic);
      return (           
        this.state.imageUri ?        
        <View>
          <Image        
            style={styles.infographic}
            source={{
              uri: this.state.imageUri,
            }}
          /> 
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