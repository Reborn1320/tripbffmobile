import React, { PureComponent } from "react";
import { tripApi  } from "../../../screens/_services/apis";
var RNFS = require('react-native-fs');
import _, { } from "lodash";
import { getCancelToken } from "../../../_function/commonFunc";
import Gallery from 'react-native-image-gallery';

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
    }

    async componentDidUpdate() {
      if (this.props.infographicId && !this.state.imageUri) {
        await this._getInfographic();
      }
    }   

    componentWillUnmount() {
      this._cancelRequest('Operation canceled by the user.');
    }

    private _getInfographic = async () => {
        tripApi
        .get(`/trips/${this.props.tripId}/infographics/${this.props.infographicId}`, {
          cancelToken: this._cancelToken
        })
        .then(res => {
          // console.log(res.request);
          var signedUrl = res.request.responseURL;
          console.log("signedUrl", signedUrl)

          const tripFolderPath = RNFS.DocumentDirectoryPath + `/${this.props.tripId}`;

          RNFS.mkdir(tripFolderPath)
          .then(async () => {
            var path = RNFS.DocumentDirectoryPath + `/${this.props.tripId}/${this.props.infographicId}.png`;

            return RNFS.downloadFile({
              fromUrl: signedUrl,
              toFile: path
            }).promise.then(response => {
              console.log("download infographic image done!", path);
              console.log("response download file", response);
              const photoUri = "file://" + path;
              console.log("photoUri", photoUri);
              this.setState({ imageUri: photoUri });     

              this.props.updateShareInfographicUrl(photoUri);
            }).catch((error) => {
                console.log('download infographic image failed.: ' + JSON.stringify(error));
            });
          })
          .catch((err) => {
            console.log(err.message, err.code);
            throw err;
          });;          

        })
        .catch(error => {
            this.props.updateShareInfographicUrl(""); 
            console.log("error: " + JSON.stringify(error));
        });
    }

    render() {        
      return (           
         <Gallery
            flatListProps={{showsHorizontalScrollIndicator: false}}
            style={{ flex: 1}}
            initialPage={0}
            images={[{source: { uri: this.state.imageUri }}]}
        /> 
      );
    }
  }