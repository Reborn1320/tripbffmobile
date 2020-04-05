import React, { PureComponent } from "react";
import { tripApi  } from "../../../screens/_services/apis";
var RNFS = require('react-native-fs');
import _, { } from "lodash";
import { getCancelToken } from "../../../_function/commonFunc";
import Gallery from 'react-native-image-gallery';
import { View } from "react-native";
``
export default class TripInfographicComponent extends PureComponent<any, any> {

    _cancelRequest;
    _cancelToken;

    constructor(props) {
      super(props);

      this.state = { 
        imageUri: ""
      };
    }    

    componentDidMount() {
      let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
      this._cancelToken = cancelToken;
      this._cancelRequest = cancelRequest;

      if (this.props.infographicExternalId) {
        this._getInfographic();
      }
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
          console.log("signedUrl", signedUrl)
          this.setState({ imageUri: signedUrl });
        })
        .catch(error => {            
            console.log("error: " + JSON.stringify(error));
        });
    }

    render() {  
      
      return (           
        this.state.imageUri ?
        <Gallery
            flatListProps={{showsHorizontalScrollIndicator: false}}
            style={{ flex: 1}}
            initialPage={0}
            images={[{source: { uri: this.state.imageUri }, dimensions: { width: 150, height: 150 }}]}
        /> :

        <View></View>
      );
    }
  }