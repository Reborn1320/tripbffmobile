import React from "react";
import { View, Icon } from "native-base";
import { Image, StyleSheet, ViewStyle, TextStyle, TouchableHighlight, TouchableOpacity } from "react-native";
import NBTheme from "../../theme/variables/material.js";
import { mixins } from "../../_utils";

export interface Props {
  width: number;
  onPress: () => void
}

export interface State {
}

export class AddLocationImageTile extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
      >
        <View style={
          [
            styles.container,
            { width: this.props.width, height: this.props.width }
          ]}>
          <Icon style={styles.icon} name="image" type="FontAwesome5" />
        </View>
      </TouchableOpacity>
    );
  }

}

interface Style {
  container: ViewStyle;
  icon: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    width: 30, height: 30,
    backgroundColor: NBTheme.colorWhite,
    borderColor: NBTheme.colorGrey,
    borderWidth: 1,
    ...mixins.centering,
    borderRadius: 2,
  },
  icon: {
    color: NBTheme.colorGrey,
    alignSelf: "center",
  }
})