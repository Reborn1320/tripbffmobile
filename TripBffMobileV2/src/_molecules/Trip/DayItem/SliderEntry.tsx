import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './SliderEntry.styles';
import { StoreData } from "../../../store/Interfaces";
import NoItemDefault from "../../../_atoms/Carousel/NoItemDefault";

interface IMapDispatchToProps {
    toLocationDetailsHanlder: () => void
}

export interface Props extends IMapDispatchToProps {   
    data: StoreData.ImportImageVM,
    parallax: boolean,
    parallaxProps: any,
    even: boolean
}

export default class SliderEntry extends Component<Props, any> {
    constructor(props) {
        super(props)
    } 

    get image() {
        const { data: { thumbnailExternalUrl }, parallax, parallaxProps, even } = this.props;

        if (thumbnailExternalUrl == "") {
            return (
                <NoItemDefault viewContainerStyle={styles.imageEmptyContainer} titleStyle={styles.subtitle} title={"Click to add image(s)"}/>
            )
        }

        return parallax ? (
            <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                <ParallaxImage
                source={{ uri: thumbnailExternalUrl }}
                containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
                style={styles.image}
                parallaxFactor={0.35}
                showSpinner={true}
                spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
                {...parallaxProps}
                />
            </View> 
        ) : (
            <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                <Image
                source={{ uri: thumbnailExternalUrl }}
                style={styles.image}
                />
            </View> 
        );
    }

    render () {
        const { data: even } = this.props;

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={this.props.toLocationDetailsHanlder}
              >
                <View style={styles.shadow} />
                { this.image }
            </TouchableOpacity>
        );
    }
}
