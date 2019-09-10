import React, { Component } from "react";
import { Container, View } from "native-base";
import { StyleSheet, Dimensions } from "react-native";
import StyledCameraRollPicker from "./StyledCameraRollPicker";
import { mixins } from "../../_utils";
import Footer2Buttons from "../Footer2Buttons";

export interface Props {
}

interface State {
  num: number,
  selectedImages: Array<any>,
  containerWidth: number,
}

export default class CameraRollPickerDoc extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    let { width } = Dimensions.get('window');

    this.state = {
      num: 0,
      selectedImages: [],
      containerWidth: width - 10 * 2
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
        <View style={{ ...mixins.centering, flex: 1 }}>
          <StyledCameraRollPicker
            containerWidth={this.state.containerWidth}
            selected={this.state.selectedImages}
            callback={this._pickImage} />
        </View>
        <Footer2Buttons
          onCancel={() => {}}
          onAction={() => {}}
          cancelText="action:cancel"
          actionText="action:delete"
          primary
        />
      </Container>
    );
  }
}