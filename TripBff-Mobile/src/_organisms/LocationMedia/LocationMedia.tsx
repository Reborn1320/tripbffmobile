import React from "react";
import { StyleSheet, TextInput, Image, ViewStyle, TextStyle } from 'react-native'
import { Text, View, H3 } from "native-base";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../store/Interfaces";
import ImageList, { calculateImageListWidth } from "../../_molecules/ImageList/ImageList";
import NBTheme from "../../theme/variables/material.js";

export interface Props {
  images: Array<StoreData.ImportImageVM>
}

export interface State {
}

export default class LocationMedia extends React.PureComponent<Props, State> {

  private renderItem = (itemInfo: { item: StoreData.ImportImageVM, index: number }) => {
    const img = itemInfo.item;
    const { itemWidth } = calculateImageListWidth();
    return (
      <Image source={{ uri: img.url }}
        style={{ width: itemWidth, height: itemWidth }} ></Image>
    );
  }

  render() {
    return (
      <View style={styles.locationMediaContainer}>
        <H3 style={styles.headerText}>Photos & Videos</H3>
        <ImageList items={this.props.images}
          renderItem={this.renderItem} />
      </View>
    );
  }
}

interface Style {
  locationMediaContainer: ViewStyle;
  headerText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  locationMediaContainer: {
    // ...mixins.themes.debug1,
    display: "flex",
    backgroundColor: NBTheme.cardDefaultBg,
    borderRadius: NBTheme.borderRadiusBase / 2,

  },
  headerText: {
    marginTop: 10,
    marginBottom: 12,
    marginLeft: 10,
  }
})
