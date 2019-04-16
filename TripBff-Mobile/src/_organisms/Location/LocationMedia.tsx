import React from "react";
import { StyleSheet, Image, ViewStyle, TextStyle } from 'react-native'
import { View, H3 } from "native-base";
import _, { } from "lodash";
import { calculateImageListWidth } from "../../_molecules/ImageList/ImageList";
import NBTheme from "../../theme/variables/material.js";
import { ImageListWithSelection } from "../../_molecules/ImageList/ImageListWithSelection";
import { LocationSelectionImage } from "./LocationSelectionImage";

export interface Props {
  images: Array<ILocationMediaImage>
  onSelect: (imageId: string) => void
  selectedImageIds: string[]

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

  private onSelect = (imageId: string) => {
    this.props.onSelect(imageId);
    // if (_.indexOf(this.state.selectedImageIds, imageId) == -1) {
    //   this.setState({
    //     selectedImageIds: [...this.state.selectedImageIds, imageId]
    //   })
    // }
    // else {
    //   this.setState({
    //     selectedImageIds: _.remove(this.state.selectedImageIds, (id) => id != imageId)
    //   })
    // }
  }

  private renderItem = (itemInfo: { item: ILocationMediaImage, index: number }) => {
    const img = itemInfo.item;

    const { itemWidth } = calculateImageListWidth();

    if (!this.props.massSelection) {
      //render a normal image that highlight
      return (
        <Image source={{ uri: img.url }}
          style={
            Object.assign({
              width: itemWidth,
              height: itemWidth
            }, styles.normalImage)} />
      );
    }

    //render in case of selection
    if (_.indexOf(this.props.selectedImageIds, img.imageId) == -1) {
      //render unselected item
      return (
        <LocationSelectionImage imageUrl={img.url} width={itemWidth} isChecked={false} />
      );
    }

    //render selected item
    return (
      <LocationSelectionImage imageUrl={img.url} width={itemWidth} isChecked={true} />
    );
  }

  render() {
    return (
      <View style={styles.locationMediaContainer}>
        <H3 style={styles.headerText}>Photos & Videos</H3>
        <ImageListWithSelection
          items={this.props.images.map(img => ({ ...img, data: img }))}
          renderItem={this.renderItem}

          onSelect={this.onSelect}

          onMassSelection={this.props.onMassSelection}
          massSelection={this.props.massSelection}
        />
      </View>
    );
  }
}

interface Style {
  locationMediaContainer: ViewStyle;
  headerText: TextStyle;
  normalImage: ViewStyle;
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
  normalImage: {

  },
})
