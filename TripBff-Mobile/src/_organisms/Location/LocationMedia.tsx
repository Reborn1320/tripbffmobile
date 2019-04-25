import React from "react";
import { StyleSheet, Image, ViewStyle, TextStyle } from 'react-native'
import { View, H3 } from "native-base";
import _, { } from "lodash";
import ImageList, { calculateImageListWidth } from "../../_molecules/ImageList/ImageList";
import NBTheme from "../../theme/variables/material.js";
import { ImageSelection } from "../../_molecules/ImageList/ImageSelection";

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
  selected: boolean;
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

  itemWidth: number;
  componentWillMount() {
    const { itemWidth } = calculateImageListWidth();
    this.itemWidth = itemWidth;
  }

  private renderItem2 = (itemInfo: { item: ILocationMediaImage, index: number }) => {
    const img = itemInfo.item;
    // console.log("render item ", img.imageId)

    //todo group all these calculation into one component with shouldUpdate
    // const { itemWidth } = calculateImageListWidth();
    const itemWidth = this.itemWidth;
    return (
      <ImageSelection imageUrl={img.url} width={itemWidth}
        isChecked={!!this.props.selectedImageIds.find(imgId => imgId == img.imageId)}
        onPress={() => this.props.onSelect(img.imageId) }
        onLongPress={this.props.onMassSelection}
      />
    )
  }


  //todo move Photo & Videos up
  render() {
    return (
      <View style={styles.locationMediaContainer}>
        <H3 style={styles.headerText}>Photos & Videos</H3>
        <ImageList
          items={this.props.images.map(img => ({ ...img, data: img }))}
          renderItem={this.renderItem2}

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
