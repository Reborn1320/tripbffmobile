import React from "react";
import { StyleSheet } from 'react-native'
import { Button, Icon } from "native-base";
import _, { } from "lodash";
import NBTheme from "../../theme/variables/material.js";
import { ImagePicker } from "expo";
import moment, { Moment } from "moment";

export interface Props {
  onSelectImageFromGallery: (uri: string, time: Moment) => void
}

export interface State {
}

export default class AddLocationImageButton extends React.PureComponent<Props, State> {

  private _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      exif: true,
    });

    console.log(result);

    if (!result.cancelled) {
      // console.log(result);
      //todo get time from exif
      const exif = (result as any).exif;
      var timeTaken = moment(exif.timeTaken);
      this.props.onSelectImageFromGallery((result as any).uri, timeTaken);
    }
  };

  render() {
    return (
      <Button rounded small
        onPress={this._pickImage}
      >
        <Icon type="FontAwesome5" name="image"></Icon>
      </Button>
    );
  }
}

interface Style {
  // locationMediaContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  locationMediaContainer: {
    // ...mixins.themes.debug1,
  },
})
