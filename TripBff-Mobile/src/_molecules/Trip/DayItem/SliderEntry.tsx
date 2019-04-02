import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './SliderEntry.styles';
import { PropsBase } from "../../../screens/_shared/LayoutContainer";
import { StoreData } from "../../../store/Interfaces";

export interface Props extends PropsBase {
    tripId: string,
    locationId: string,
    dateIdx: number,
    data: StoreData.ImportImageVM,
    parallax: boolean,
    parallaxProps: any,
    even: boolean
}

export default class SliderEntry extends Component<Props, any> {
    constructor(props) {
        super(props)
    } 

    _toLocationDetail = () => {
        var { tripId, dateIdx, locationId } = this.props;
        this.props.navigation.navigate("LocationDetail", { tripId, locationId, dateIdx })
    }

     get image() {
        const { data: { url }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: url }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: url }}
              style={styles.image}
            />
        );
    }

    render () {
        const { data: even } = this.props;

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={this._toLocationDetail}
              >
                <View style={styles.shadow} />
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    { this.image }
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View> 
            </TouchableOpacity>
        );
    }
}
