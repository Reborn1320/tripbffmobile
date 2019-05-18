import React from "react";
import { StyleSheet } from 'react-native'
import { Button, Icon } from "native-base";
import _, { } from "lodash";

export interface Props {
  openImagePickerModal: () => void
}

export interface State {
}

export default class AddLocationImageButton extends React.PureComponent<Props, State> { 

  render() {
    return (
      <Button rounded small
        onPress={this.props.openImagePickerModal}
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
