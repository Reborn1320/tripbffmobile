import React, { PureComponent } from "react";
import { tripApi  } from "../../../screens/_services/apis";
import _, { } from "lodash";
import { getCancelToken } from "../../../_function/commonFunc";
import Gallery from 'react-native-image-gallery';
import { View, Text, ViewStyle, TextStyle, StyleSheet } from "react-native";
import { mixins } from "../../../_utils";
import NBColor from "../../../theme/variables/commonColor.js";
import { Icon } from "native-base";
import { withNamespaces } from "react-i18next";
import Flurry from 'react-native-flurry-sdk';

class TripInfographicComponent extends PureComponent<any, any> {

    _cancelRequest;
    _cancelToken;

    constructor(props) {
      super(props);

      this.state = { 
        imageUri: "",
        hasInfographic: this.props.infographicExternalId != null
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
          console.log("signedUrl", signedUrl)
          this.setState({ imageUri: signedUrl, hasInfographic: !signedUrl });

          if (!signedUrl)
            this.props.goTripEditTimeline();
        })
        .catch(error => {            
            console.log("error: " + JSON.stringify(error));
        });
    }

    render() {  
      const { t } = this.props;

      return (           
        this.state.imageUri ?
        <Gallery
            flatListProps={{showsHorizontalScrollIndicator: false}}
            style={{ flex: 1}}
            initialPage={0}
            images={[{source: { uri: this.state.imageUri }, dimensions: { width: 150, height: 150 }}]}
        /> :
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

  export default withNamespaces(['message'])(TripInfographicComponent);

interface Style {
  container: ViewStyle;
  emptyMsgContainer: ViewStyle;
  emptyMsg: TextStyle;
  warningMsgIcon: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
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
  },
  warningMsgIcon: {
      fontSize: 18,
      color: NBColor.brandWarning,
      marginRight: 10
  },
})