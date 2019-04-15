import React from "react";
import { TextInput, Image } from 'react-native'
import { Text, View } from "native-base";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../store/Interfaces";
import ImageList from "../../_molecules/ImageList/ImageList";

export interface Props {
  images: Array<StoreData.ImportImageVM>
}

export interface State {
}

export default class LocationMedia extends React.PureComponent<Props, State> {

  private renderItem = (index) => {
    const img = this.props.images[index];
    return (
      <Image source={{ uri: img.url }}
        style={{ width: 120 - 2, height: 120 - 2 }} ></Image>
    );
  }

  render() {
    return (
      <View>
        <Text>Photos & Videos</Text>
        <ImageList items={this.props.images}
          renderItem={this.renderItem} />
      </View>
    );
  }
}