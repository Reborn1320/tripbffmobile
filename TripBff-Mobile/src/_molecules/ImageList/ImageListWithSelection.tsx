import React, { ReactNode } from "react";

import { StyleSheet, View, ViewStyle, Dimensions, TouchableHighlight } from "react-native";
import { mixins } from "../../_utils";
import ImageList from "./ImageList";

export interface Props {
  items: Array<IImage>
  renderItem: ({ item: IImage, index: number }) => ReactNode
  // renderMassSelectionItem: ({ item: IImage, index: number }) => ReactNode

  onSelect: (imageId: string) => void
  // selectedImageIds: any[]

  onMassSelection: () => void
  massSelection: boolean

  width?: number
  paddingLeftRight?: number
}

interface States {
}

interface IImage {
  imageId: string;
  url: string;
  data: any;
}


export class ImageListWithSelection extends React.Component<Props, States> {

  constructor(prop: Props) {
    super(prop);

    this.state = {
      // selectedImageIds: []
    }
  }

  private onPress = (imageId: string) => {
    this.props.onSelect(imageId);
  }

  private onLongPress = () => {
    this.props.onMassSelection();
  }

  private renderItem = (itemInfo: { item: IImage, index: number }) => {

    if (this.props.massSelection) {
      return (
        <TouchableHighlight
          onPress={() => this.onPress(itemInfo.item.imageId)}
        >
          {this.props.renderItem(itemInfo)}
        </TouchableHighlight>
      );
    }

    return (
      <TouchableHighlight
        onPress={() => this.onPress(itemInfo.item.imageId)}
        onLongPress={this.onLongPress}
      >
        {this.props.renderItem(itemInfo)}
      </TouchableHighlight>
    );
  }

  render() {
    const { items } = this.props;
    return (
      <ImageList items={items} renderItem={this.renderItem} />
    );
  }
}

// interface Style {
// }

// const styles = StyleSheet.create<Style>({
// })