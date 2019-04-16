import React from "react";
import { StyleSheet, Image, ViewStyle, TextStyle, TouchableHighlight } from 'react-native'
import { Text, View, H3 } from "native-base";
import _, { } from "lodash";
import ImageList, { calculateImageListWidth } from "../../_molecules/ImageList/ImageList";
import NBTheme from "../../theme/variables/material.js";
import { ImageListWithSelection } from "../../_molecules/ImageList/ImageListWithSelection";
import { LocationSelectionImage } from "./LocationSelectionImage";

export interface Props {
  images: Array<ILocationMediaImage>
  onMassSelection: () => void
  massSelection: boolean
}

export interface State {
  selectedImageIds: string[]
}

interface ILocationMediaImage {
  imageId: string;
  url: string;
}

export default class LocationMedia extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedImageIds: []
    }
  }

  private onSelect = (imageId: string) => {
    if (_.indexOf(this.state.selectedImageIds, imageId) == -1) {
      this.setState({
        selectedImageIds: [...this.state.selectedImageIds, imageId]
      })
    }
    else {
      this.setState({
        selectedImageIds: _.remove(this.state.selectedImageIds, (id) => id != imageId)
      })
    }
  }

  private renderItem = (itemInfo: { item: ILocationMediaImage, index: number }) => {
    const img = itemInfo.item;

    const { itemWidth } = calculateImageListWidth();
    const itemMargin = this.props.massSelection == true ? 5 : 0;
    const itemStyle = this.props.massSelection == true ? styles.selectedImage : styles.unselectedImage;

    //todo move these 3 rendering into a separated component ?
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
    if (_.indexOf(this.state.selectedImageIds, img.imageId) == -1) {
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
  normalImage: {

  },
  selectedImage: {
    padding: 5,
  },
  unselectedImage: {
  }
})
