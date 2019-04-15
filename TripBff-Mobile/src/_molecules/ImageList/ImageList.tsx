import React, { ReactNode } from "react";

import { StyleSheet, View, ViewStyle, Dimensions } from "react-native";
import { mixins } from "../../_utils";

export interface Props {
  items: Array<any>
  renderItem: (index: number) => ReactNode
  width?: number
}

interface States {
  listWidth: number;
  itemWidth: number;
}

class ImageList extends React.Component<Props, States> {

  constructor(prop: Props) {
    super(prop);

    let listWidth = this.props.width ? this.props.width : Dimensions.get("window").width;
    // listWidth -= 2;
    this.state = {
      listWidth,
      itemWidth: listWidth / 3
    }
    console.log(this.state.listWidth);
  }

  _renderItem = (itemInfo) => {
    const idx: number = itemInfo.index

    return (
      <View
        style={Object.assign({ width: this.state.itemWidth }, styles.itemContainer)}
        key={idx}
      >
        {this.props.renderItem(itemInfo.index)}
      </View>
    );
  }

  //todo change to FlatList...
  render() {
    const { items } = this.props;
    return (
      <View style={styles.listImageContainer}
      // data={images}
      // renderItem={this._renderItem}
      // keyExtractor={(item, index) => String(index)}
      >
        {items.map((item, index) => this._renderItem({ item, index }))}
      </View>
    );
  }
}

interface Style {
  listImageContainer: ViewStyle;
  itemContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  listImageContainer: {
    // ...mixins.themes.debug1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemContainer: {
    // ...mixins.themes.debug2,
    padding: 1,
  },
})

export default ImageList;