import React, { Component } from "react";
import _, { } from "lodash";
import { mixins } from "../../_utils";
import { Container, View } from "native-base";
import CameraRollPicker from "./index";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, Dimensions } from "react-native";
import NBTheme from "../../theme/variables/material.js";
import { SelectedTileOverlay } from "./SelectedTileOverlay";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
}

interface State {
  num: number,
  selectedImages: Array<any>,
  imageWidth: number,
}

export default class CameraRollPickerDoc extends Component<Props, State> {

  private imageWidth: number;

  constructor(props: Props) {
    super(props)

    let { width } = Dimensions.get('window');
    console.log(width);
    const imageMargin = 1;
    const imagesPerRow = 3;

    this.state = {
      num: 0,
      selectedImages: [],
      imageWidth: (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow
    }
  }


  private _pickImage = (images) => {
    var num = images.length;

    this.setState({
      num: num,
      selectedImages: images
    });
  }

  render() {
    return (
      <Container>
        <CameraRollPicker
          selected={this.state.selectedImages}
          imageMargin={1}
          selectedMarker={(<SelectedTileOverlay width={this.state.imageWidth} />)}
          callback={this._pickImage} />
      </Container>
    );
  }
}


interface Style {
  marker: any;
}

const styles = StyleSheet.create<Style>({
  marker: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'transparent',
    fontSize: 25,
    height: 27,
    color: "green",
    // ...mixins.centering,
  },
})
  

