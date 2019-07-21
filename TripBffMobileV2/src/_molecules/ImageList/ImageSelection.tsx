import React from "react";
import { View, Icon } from "native-base";
import { Image, StyleSheet, ViewStyle, TextStyle, TouchableHighlight } from "react-native";
import NBTheme from "../../theme/variables/material.js";
import { mixins } from "../../_utils";

export interface Props {
  imageUrl: string
  isChecked?: boolean
  isDisplayFavorited?: boolean
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
          <Image
            style={Object.assign({ width, height: width }, isChecked ? styles.checkImage : styles.image)}
            source={{ uri: this.props.imageUrl }}
          />
          {isChecked == true &&
            <View style={Object.assign({ width, height: width }, styles.overlay)}>
            </View>
          }
          {isChecked == true &&
            <View style={Object.assign({ width, height: width, position: "absolute", ...mixins.centering })}>
              <View style={{ position: "absolute", width: 19, height: 19, backgroundColor: "white", borderRadius: 99 }} />
              <Icon style={styles.checkIcon} active solid type="FontAwesome5" name="check-circle" />
            </View>
          }
          {
            this.props.isDisplayFavorited && 
              <View style={styles.favoriteContainer}>
                  <Icon style={styles.favoriteIcon} active solid type="FontAwesome5" name="heart" />
              </View>
          }
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
  overlay: ViewStyle;
  checkIcon: TextStyle;
  favoriteContainer: ViewStyle,
  favoriteIcon: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    // ...mixins.themes.debug1,
    // backgroundColor: NBTheme.cardDefaultBg,
  },
  image: {},
  checkImage: {
    // borderColor: NBTheme.brandDark,
    // borderWidth: 4,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    backgroundColor: "black",
    opacity: 0.35
  },
  checkIcon: {
    color: NBTheme.brandPrimary,
    width: 25,
    height: 25,
    fontSize: 23,
  },
  favoriteContainer: {
    width: 30, height: 30,
    position: "absolute",
    left: 0,
    top: 0,
    elevation: 50,
    ...mixins.centering
  },
  favoriteIcon: {
    color: NBTheme.colorRed,
    width: 20,
    height: 20,
    margin: 5,
    fontSize: 18,
    textAlign: "center",
  }
})