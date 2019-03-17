import React, { Component } from 'react'
import { View } from 'native-base';
import { Image, Dimensions } from "react-native";
import { ImageVM } from '../../../_organisms/Trip/TripDetails/TripDetails';

export interface Props {
    images: ImageVM[]
}

export interface State {
}

export default class LocationImage extends Component<Props, State> {
    render() {
        const firstImage = this.props.images.length > 0
                                ? this.props.images[0].url
                                : "";

        const MARGIN_LEFT = 10
        const MARGIN_RIGHT = 10
        const SIZE = Dimensions.get('window').width - MARGIN_LEFT - MARGIN_RIGHT;
        const SIZE23 = SIZE * 2 / 3

        return (
            <View
                style={{ width: SIZE, height: SIZE23 }}
            >
                <Image source={{ uri: firstImage }} style={{ width: SIZE, height: SIZE23 }}
                />
            </View>
        )
    }
}
