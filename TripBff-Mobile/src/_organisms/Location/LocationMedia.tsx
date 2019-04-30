import React from "react";
import { StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { View, H3 } from "native-base";
import _, { } from "lodash";
import ImageList, { calculateImageListWidth, N_ITEMS_PER_ROW } from "../../_molecules/ImageList/ImageList";
import NBTheme from "../../theme/variables/material.js";
import { ImageSelection } from "../../_molecules/ImageList/ImageSelection";
import { ImageFavorable } from "../../_molecules/ImageList/ImageFavorable";

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
  isFavorite: boolean;
}

export default class LocationMedia extends React.PureComponent<Props, State> {

  itemWidth: number;
  componentWillMount() {
    const { itemWidth } = calculateImageListWidth();
    this.itemWidth = itemWidth;
  }

  private renderItem2 = (itemInfo: { item: ILocationMediaImage, index: number, styleContainer: ViewStyle }) => {
    const img = itemInfo.item;

    const itemWidth = this.itemWidth;
    const { massSelection } = this.props;

    if (massSelection == false) {
      return (
        <ImageFavorable
          key={img.imageId}
          imageUrl={img.url} width={itemWidth}
          isFirstItemInRow={itemInfo.index % N_ITEMS_PER_ROW == 0}
          isFirstRow={itemInfo.index < N_ITEMS_PER_ROW}

          isChecked={img.isFavorite}
          onPressedOnFavoriteIcon={() => this.props.onSelect(img.imageId)}
          onLongPress={this.props.onMassSelection}
        />
      )
    }
    return (
      <ImageSelection
        key={img.imageId}
        imageUrl={img.url} width={itemWidth}
        isFirstItemInRow={itemInfo.index % N_ITEMS_PER_ROW == 0}
        isFirstRow={itemInfo.index < N_ITEMS_PER_ROW}

        isChecked={this.props.massSelection ? !!this.props.selectedImageIds.find(imgId => imgId == img.imageId) : undefined}
        onPress={() => this.props.onSelect(img.imageId)}
        onLongPress={this.props.onMassSelection}
      />
    )
  }

  render() {
    // console.log("n images ", this.props.images.length);
    return (
      <View style={styles.locationMediaContainer}>
        <H3 style={styles.headerText}>Photos & Videos</H3>
        <ImageList
          items={this.props.images}
          renderItem={this.renderItem2}
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
