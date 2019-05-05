import React from "react";
import { View, Icon } from "native-base";
import { Image, StyleSheet, ViewStyle, TextStyle, TouchableHighlight } from "react-native";
import NBTheme from "../../theme/variables/material.js";

export interface Props {
  imageUrl: string
  isChecked?: boolean
  width: number

  onPress: () => void
  onLongPress?: () => void

  isFirstRow: boolean
  isFirstItemInRow: boolean
}

export interface State {
}

export class ImageSelection extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
    }
  }
  shouldComponentUpdate(nextProps: Props, nextState) {
    // console.log(this.props.isChecked != nextProps.isChecked)
    return this.props.isChecked != nextProps.isChecked
    || this.props.imageUrl != nextProps.imageUrl;
  }

  render() {
    const { width, isChecked, isFirstRow, isFirstItemInRow } = this.props;
    return (
      <View style={{
        marginTop: isFirstRow ? 0 : 2,
        marginLeft: isFirstItemInRow ? 0 : 2,
      }}>
      <TouchableHighlight
        onPress={this.props.onPress}
        onLongPress={() => this.props.onLongPress ? this.props.onLongPress() : true }
      >
        <View
        style={{
            width, height: width,
            position: "relative",
          }}
        >
          {isChecked == false && <Icon style={styles.unCheckIcon} type="FontAwesome5" name="circle" />}
          {/* this is not an issue, use solid to pass option into react-native-icons */}
          {isChecked == true && <Icon style={styles.checkIcon} active solid type="FontAwesome5" name="check-circle" />}
          <Image
            style={Object.assign({ width, height: width }, isChecked ? styles.checkImage : styles.image)}
            source={{ uri: this.props.imageUrl }}
          />
        </View>
      </TouchableHighlight>
      </View>
    );
  }

}

interface Style {
  container: ViewStyle;
  image: ViewStyle;
  checkImage: ViewStyle;
  unCheckIcon: TextStyle;
  checkIcon: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    // ...mixins.themes.debug1,
    // backgroundColor: NBTheme.cardDefaultBg,
  },
  image: {},
  checkImage: {
    borderColor: NBTheme.brandDark,
    borderWidth: 4,
  },
  unCheckIcon: {
    position: "absolute",
    right: 5,
    top: 5,
    elevation: 5,
    color: NBTheme.brandLight,
    width: 20,
    height: 20,
    fontSize: 18,
    textAlign: "center",
  },
  checkIcon: {
    position: "absolute",
    right: 5,
    top: 5,
    elevation: 5,
    color: NBTheme.brandSuccess,
    backgroundColor: NBTheme.brandLight,
    borderRadius: 99,
    width: 20,
    height: 20,
    fontSize: 18,
    textAlign: "center",
  }
})