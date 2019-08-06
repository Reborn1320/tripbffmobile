import React from "react";
import { View, Icon } from "native-base";
import { Image, StyleSheet, ViewStyle, TextStyle, TouchableHighlight } from "react-native";
import NBTheme from "../../theme/variables/material.js";
import { mixins } from "../../_utils";

export interface Props {
  width: number;
}

export interface State {
}

export class SelectedTileOverlay extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { width } = this.props;
    return (
      <View style={{ position: "absolute", width, height: width, top: 0, left: 0 }}>
        <View
          style={{
            width, height: width,
            position: "relative",
          }}
        >
          <View style={Object.assign({ width, height: width }, styles.overlay)}>
          </View>
          <View style={Object.assign({ width, height: width, position: "absolute", ...mixins.centering })}>
            <View style={{ position: "absolute", width: 19, height: 19, backgroundColor: "white", borderRadius: 99 }} />
            <Icon style={styles.checkIcon} solid type="FontAwesome5" name="check-circle" />
          </View>
        </View>
      </View>
    );
  }

}

interface Style {
  overlay: ViewStyle;
  checkIcon: TextStyle;
}

const styles = StyleSheet.create<Style>({
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: "black",
    opacity: 0.35
  },
  checkIcon: {
    color: NBTheme.brandPrimary,
    width: 25,
    height: 25,
    fontSize: 23,
  },
})