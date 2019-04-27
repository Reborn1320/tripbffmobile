import React, { ReactNode } from "react";

import { StyleSheet, View, ViewStyle, Dimensions, FlatList } from "react-native";
import { mixins } from "../../_utils";

export interface Props {
  items: Array<any>
  renderItem: ({ item: any, index: number }) => ReactNode
  width?: number
  paddingLeftRight?: number
}

interface States {
  itemWidth: number;
}

export const N_ITEMS_PER_ROW = 3;
export const IN_BETWEEN_ITEMS_MARGIN = 2;
// w + 2 + w + 2 + w
export function calculateImageListWidth(paddingLeft: number = 0, paddingRight: number = 0) {
  const width = Dimensions.get("window").width;
  const listWidth = width - paddingLeft - paddingRight;
  const itemWidth = getItemWidthFromListWidth(listWidth);

  return { listWidth, itemWidth };
}

function getItemWidthFromListWidth(listWidth: number) {
  return (listWidth - (N_ITEMS_PER_ROW - 1) * IN_BETWEEN_ITEMS_MARGIN) / N_ITEMS_PER_ROW;
}

export function isFirstItemInRow(idx, nItemPerRow = N_ITEMS_PER_ROW) {
  return idx % N_ITEMS_PER_ROW == 0
}

class ImageList extends React.Component<Props, States> {

  constructor(prop: Props) {
    super(prop);

    let listWidth = this.props.width ? this.props.width : Dimensions.get("window").width;

    if (this.props.paddingLeftRight) {
      listWidth -= 2 * this.props.paddingLeftRight;
    }
    // listWidth -= 2;
    this.state = {
      itemWidth: getItemWidthFromListWidth(listWidth)
    }
  }

  // private _renderItem = (itemInfo: { item: any, index: number }) => {
  //   const idx: number = itemInfo.index

  //   // const styleContainer = Object.assign({ width: this.state.itemWidth },
  //   //   idx % N_ITEMS_PER_ROW == 0 ? styles.firstInRowItemContainer : styles.itemContainer);
    
  //   return this.props.renderItem({
  //     item: itemInfo.item,
  //     index: itemInfo.index,
  //     // styleContainer
  //   });
  // }

  render() {
    const { items } = this.props;
    return (
      <View style={styles.listImageContainer}
      // data={items}
      // renderItem={this.props.renderItem}
      // keyExtractor={(item, index) => index.toString()}
      >
        {items.map((item, index) => this.props.renderItem({ item, index }))}
      </View>
    );
  }
}

interface Style {
  listImageContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  listImageContainer: {
    // ...mixins.themes.debug1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  }
})

export default ImageList;