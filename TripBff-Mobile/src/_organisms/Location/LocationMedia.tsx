import React from "react";
import { StyleSheet, Image, ViewStyle, TextStyle, TouchableHighlight } from 'react-native'
import { Text, View, H3 } from "native-base";
import _, { } from "lodash";
import ImageList, { calculateImageListWidth } from "../../_molecules/ImageList/ImageList";
import NBTheme from "../../theme/variables/material.js";

export interface Props {
  images: Array<ILocationMediaImage>
  onMassSelection: () => void
  massSelection: boolean
}

export interface State {
}

interface ILocationMediaImage {
  imageId: string;
  url: string;
}

export default class LocationMedia extends React.PureComponent<Props, State> {

  private onPress = () => {
    //todo select, unselect
  }

  private toMassSelectionState = () => {
    this.props.onMassSelection();
  }

  private renderItem = (itemInfo: { item: ILocationMediaImage, index: number }) => {
    const img = itemInfo.item;
    const { itemWidth } = calculateImageListWidth();
    const itemMargin = this.props.massSelection == true ? 5 : 0;
    const itemStyle = this.props.massSelection == true ? styles.selectedImage : styles.unselectedImage;

    return (
      <TouchableHighlight
        onPress={this.onPress}
        onLongPress={this.toMassSelectionState}
      >
        <Image source={{ uri: img.url }}
          style={
            Object.assign({
              width: itemWidth - itemMargin * 2,
              height: itemWidth - itemMargin * 2
            }, itemStyle)} ></Image>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.locationMediaContainer}>
        <H3 style={styles.headerText}>Photos & Videos</H3>
        <ImageList
          items={this.props.images}
          renderItem={this.renderItem} />
      </View>
    );
  }
}

interface Style {
  locationMediaContainer: ViewStyle;
  headerText: TextStyle;
  selectedImage: ViewStyle;
  unselectedImage: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  locationMediaContainer: {
    // ...mixins.themes.debug1,
    display: "flex",
    backgroundColor: NBTheme.cardDefaultBg,
    borderRadius: NBTheme.borderRadiusBase / 2,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,

  },
  headerText: {
    marginTop: 10,
    marginBottom: 12,
    marginLeft: 10,
  },
  selectedImage: {
    padding: 5,
  },
  unselectedImage: {
  }
})
