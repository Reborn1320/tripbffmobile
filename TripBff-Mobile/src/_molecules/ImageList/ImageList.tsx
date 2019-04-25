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

const N_ITEMS_PER_ROW = 3;
const IN_BETWEEN_ITEMS_MARGIN = 2;
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

  private _renderItem = (itemInfo: { item: any, index: number }) => {
    const idx: number = itemInfo.index

    return (
      <View
        style={
          Object.assign(
            { width: this.state.itemWidth },
            idx % N_ITEMS_PER_ROW == 0 ? styles.firstInRowItemContainer : styles.itemContainer)
        }
        key={idx}
      >
        {this.props.renderItem(itemInfo)}
      </View>
    );
  }

  render() {
    const { items } = this.props;
    return (
      <FlatList style={styles.listImageContainer}
      data={items}
      renderItem={this.props.renderItem}
      keyExtractor={(item, index) => item.imageId}
      >
        {/* {items.map((item, index) => this._renderItem({ item, index }))} */}
      </FlatList>
    );
  }
}

interface Style {
  listImageContainer: ViewStyle;
  firstInRowItemContainer: ViewStyle;
  itemContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  listImageContainer: {
    // ...mixins.themes.debug1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  firstInRowItemContainer: {
    // ...mixins.themes.debug2,
    margin: 0,
    marginTop: IN_BETWEEN_ITEMS_MARGIN
  },
  itemContainer: {
    // ...mixins.themes.debug1,
    margin: 0,
    marginTop: IN_BETWEEN_ITEMS_MARGIN,
    marginLeft: IN_BETWEEN_ITEMS_MARGIN,
  },
})

export default ImageList;