import React, { Component } from "react";
import CameraRollPicker from "./index";
import { StyleSheet, Dimensions } from "react-native";
import NBTheme from "../../theme/variables/material.js";
import { SelectedTileOverlay } from "./SelectedTileOverlay";

export interface Props {
  callback: (images) => void;
  selected: any[],
  containerWidth?: number
}

interface State {
  num: number,
  selectedImages: Array<any>,
  imageWidth: number,

}

export default class StyledCameraRollPicker extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    let { width } = Dimensions.get('window');
    console.log(width);
    const imageMargin = 1;
    const imagesPerRow = 3;

    this.state = {
      num: 0,
      selectedImages: [],
      imageWidth: (props.containerWidth ? props.containerWidth : width - (imagesPerRow + 1) * imageMargin) / imagesPerRow
    }
  }

  render() {
    return (
      <CameraRollPicker
        selected={this.props.selected}
        imageMargin={1}
        containerWidth={this.props.containerWidth}
        selectedMarker={(<SelectedTileOverlay width={this.state.imageWidth} />)}
        callback={this.props.callback} />
    );
  }
}


interface Style {
}

const styles = StyleSheet.create<Style>({
})


