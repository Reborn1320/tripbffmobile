import React, { Component } from 'react'
import { View } from 'native-base';
import { Image, Dimensions } from "react-native";

export interface Props {
    images: { url: string }[]
}

export interface State {
}

export default class Location3Images extends Component<Props, State> {
  render() {
      const nImages = this.props.images.length;
    const firstImage = this.props.images[0].url;
    const meanImage = this.props.images[nImages % 2 == 0 ? nImages / 2 - 1 : (nImages - 1) / 2 + 1].url;
    const lastImage = this.props.images[this.props.images.length - 1].url;

    const MARGIN_LEFT = 10
    const MARGIN_RIGHT = 10
    const SIZE = Dimensions.get('window').width - MARGIN_LEFT - MARGIN_RIGHT;
    const SIZE23 = SIZE * 2 / 3
    
    return (
        <View 
        style={{width: SIZE, height: SIZE23}}
    >
        <Image source={{ uri: firstImage }} style={{ position: "absolute", width: SIZE23 - 2, height: SIZE23, left: 0 }}

        />
        <Image source={{ uri: meanImage }} style={{ position: "absolute", width: SIZE23 / 2, height: SIZE23 / 2 - 1, left: SIZE23, }}

        />
        <Image source={{ uri: lastImage }} style={{ position: "absolute", width: SIZE23 / 2, height: SIZE23 / 2 - 1, left: SIZE23, top: SIZE23 / 2 + 1 }}

        />
    </View>
    )
  }
}
