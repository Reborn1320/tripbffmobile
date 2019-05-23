import React, { PureComponent } from "react";
import {  Image, Dimensions } from "react-native";
import { View } from "native-base";
import { tripApi  } from "../../_services/apis";
var RNFS = require('react-native-fs');
import _, { } from "lodash";
import { calculateByPercentage } from "../../../_function/commonFunc";
import ImageZoom from 'react-native-image-pan-zoom';


export default class PreviewInfographicComponent extends PureComponent<any, any> {
    constructor(props) {
      super(props);

      this.state = { 
        imageUri: ""
      };
    }    

    componentDidUpdate() {
      if (this.props.infographicId && !this.state.imageUri) {
        this._getInfographic();
      }
    }   

    private _getInfographic = () => {
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