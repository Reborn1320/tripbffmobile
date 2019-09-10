import React from "react";
import { View, Icon } from "native-base";
import { Image, StyleSheet, ViewStyle, TextStyle, TouchableHighlight, TouchableOpacity } from "react-native";
import NBTheme from "../../theme/variables/material.js";
import { mixins } from "../../_utils";
// import { mixins } from "../../_utils.js";
import FastImage from 'react-native-fast-image';

export interface Props {
  imageUrl: string
  isChecked: boolean
  width: number

  onPress?: () => void
  onPressedOnFavoriteIcon?: () => void
  onLongPress?: () => void

  isFirstRow: boolean
  isFirstItemInRow: boolean
}

export interface State {
}

export class ImageFavorable extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
    }
  }
  shouldComponentUpdate(nextProps: Props, nextState) {
    return this.props.isChecked != nextProps.isChecked
    || this.props.imageUrl != nextProps.imageUrl;
  }

  private renderIcon(isChecked) {
    if (isChecked == true) {
      return (
        <Icon style={styles.checkIcon} active solid type="FontAwesome5" name="heart" />
      )
    }

    return (
      <Icon style={styles.unCheckIcon} type="FontAwesome5" name="heart" />
    )
  }

  render() {
    const { width, isChecked, isFirstRow, isFirstItemInRow } = this.props;
    return (
      <View style={{
        marginTop: isFirstRow ? 0 : 2,
        marginLeft: isFirstItemInRow ? 0 : 2,
      }}>
      <TouchableHighlight
        onPress={() => this.props.onPress ? this.props.onPress() : true }
        onLongPress={() => this.props.onLongPress ? this.props.onLongPress() : true}
      >
        <View style={{
          position: "relative"
        }}>
          <FastImage
            style={Object.assign({ width, height: width }, isChecked ? styles.checkImage : styles.image)}
            source={{ uri: this.props.imageUrl }}
          />
          <View
            style={styles.container}
          >
            <TouchableOpacity
              onPress={() => this.props.onPressedOnFavoriteIcon ? this.props.onPressedOnFavoriteIcon() : true }
            >
              <View>
                {this.renderIcon(isChecked)}
              </View>
            </TouchableOpacity>
          </View>
        </View >
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
    width: 30, height: 30,
    position: "absolute",
    left: 0,
    top: 0,
    elevation: 50,
    ...mixins.centering
  },
  image: {},
  checkImage: {
    // borderColor: NBTheme.brandDark,
    // borderWidth: 4,
  },
  unCheckIcon: {
    // ...mixins.themes.debug,
    color: NBTheme.brandLight,
    width: 20,
    height: 20,
    margin: 5,
    fontSize: 18,
    textAlign: "center",
  },
  checkIcon: {
    color: NBTheme.colorRed,
    width: 20,
    height: 20,
    margin: 5,
    fontSize: 18,
    textAlign: "center",
  }
})