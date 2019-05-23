import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './SliderEntry.style';

export default class SliderEntry extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object,
        clickHandler: PropTypes.func,
    };

    get image () {
        const { data: { illustration }, parallax, parallaxProps, even } = this.props;

        if (illustration == "") {
            return (
            <View style={styles.imageEmptyContainer}>
                <Icon type="FontAwesome5" name="plus" style={{ fontSize: 40, color: "lightgrey" }}/>
            </View>)
        }

        return parallax ? (
            <ParallaxImage
              source={{ uri: illustration }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
        );
    }

    render () {
        const { data: { title, subtitle, illustration }, even, clickHandler } = this.props;

        const isEmpty = illustration == "";
        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, even ? styles.titleEven : {}]}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={clickHandler}
              >
                <View style={styles.shadow} />
                <View style={[styles.imageContainer, { backgroundColor: "white" }]}>
                    { this.image }
                    {/* <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}, isEmpty && !even ? styles.radiusMaskBorder : {}]} /> */}
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}, isEmpty && !even ? styles.textContainerBorder : {}]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                      numberOfLines={2}
                    >
                        { subtitle }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}