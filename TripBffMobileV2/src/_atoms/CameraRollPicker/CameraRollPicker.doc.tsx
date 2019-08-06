import React, { Component } from "react";
import _, { } from "lodash";
import { mixins } from "../../_utils";
import { Container } from "native-base";
import CameraRollPicker from "./index";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet } from "react-native";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
}

interface State {
  num: number,
  selectedImages: Array<any>,
}

export default class CameraRollPickerDoc extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      num: 0,
      selectedImages: [],
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
          selectedMarker={(<Icon name="check-circle" style={styles.marker} />)}
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
    color: "green"
  },
})
  

