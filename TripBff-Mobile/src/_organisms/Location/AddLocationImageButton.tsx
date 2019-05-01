import React from "react";
import { StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { View, H3, Button, Icon } from "native-base";
import _, { } from "lodash";
import ImageList, { calculateImageListWidth, N_ITEMS_PER_ROW } from "../../_molecules/ImageList/ImageList";
import NBTheme from "../../theme/variables/material.js";
import { ImagePicker } from "expo";

export interface Props {
  onSelectImageFromGallery: (uri: string) => void
}

export interface State {
}

export default class AddLocationImageButton extends React.PureComponent<Props, State> {

  private _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
    });

    console.log(result);

    if (!result.cancelled) {
      // console.log(result);
      this.props.onSelectImageFromGallery((result as any).uri);
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
