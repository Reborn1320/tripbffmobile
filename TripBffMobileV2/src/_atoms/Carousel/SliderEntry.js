import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "native-base";
import PropTypes from "prop-types";
import { ParallaxImage, Pagination } from "react-native-snap-carousel";
import styles from "./SliderEntry.style";
import stylesPaging, { colors } from "./index.style";
import NoItemDefault from "./NoItemDefault";
import indexStyle from "./index.style";
import {
  NUMBER_PAGINATION_DOTS,
  INDEX_STABLE,
} from "../../screens/_services/SystemConstants";
import AuthorizedImage from "../AuthorizedImage";

export default class SliderEntry extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
    clickHandler: PropTypes.func,
  };

  get image() {
    const {
      data: { title, subtitle, illustration },
      parallax,
      parallaxProps,
      even,
    } = this.props;

    if (illustration == "") {
      return (
        <NoItemDefault
          viewContainerStyle={styles.imageEmptyContainer}
          titleStyle={styles.subtitle}
          subtitle={subtitle}
        />
      );
    }

    return parallax ? (
      <ParallaxImage
        source={{ uri: illustration }}
        containerStyle={[
          styles.imageContainer,
          even ? styles.imageContainerEven : {},
        ]}
        style={styles.image}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.25)"}
        {...parallaxProps}
      />
    ) : (
      // <AuthorizedImage
      //   source={{ uri: illustration }}
      //   style={Object.assign(
      //     title
      //       ? {}
      //       : {
      //           borderBottomLeftRadius: 8,
      //           borderBottomRightRadius: 8,
      //         },
      //     styles.image
      //   )}
      // />
      <Image
        source={{ uri: illustration }}
        style={Object.assign(
          title
            ? {}
            : {
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              },
          styles.image
        )}
      />
    );
  }

  _calculatePagination = (numberOfEntries, index) => {
    let numberOfDots = numberOfEntries,
      indexOfDot = index;

    if (numberOfEntries > NUMBER_PAGINATION_DOTS) {
      numberOfDots = NUMBER_PAGINATION_DOTS;

      if (index <= INDEX_STABLE - 1) {
        indexOfDot = index;
      } else if (index >= numberOfEntries - INDEX_STABLE + 1) {
        indexOfDot = index - (numberOfEntries - NUMBER_PAGINATION_DOTS);
      } else {
        indexOfDot = INDEX_STABLE;
      }
    }

    return {
      numberOfDots,
      indexOfDot,
    };
  };

  setFavorite() {
    let paginationDot = this._calculatePagination(
      this.props.numberOfEntries,
      this.props.index
    );

    return (
      <View style={styles1.footerContainer}>
        <Pagination
          dotsLength={paginationDot.numberOfDots}
          activeDotIndex={paginationDot.indexOfDot}
          containerStyle={stylesPaging.paginationContainer}
          dotStyle={stylesPaging.paginationDot}
          inactiveDotStyle={stylesPaging.inactivePaginationDot}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
      </View>
    );
  }

  render() {
    const {
      data: { title, illustration },
      even,
      clickHandler,
    } = this.props;
    const uppercaseTitle = title ? (
      <Text style={[styles.title]} numberOfLines={1}>
        {title}
      </Text>
    ) : (
      false
    );

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={clickHandler}
      >
        <View style={[styles.imageContainer, { borderRadius: 10 }]}>
          {this.image}
          {this.setFavorite()}
        </View>
        {uppercaseTitle && (
          <View style={[styles.textContainer]}>{uppercaseTitle}</View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles1 = StyleSheet.create({
  footerContainer: {
    bottom: 0,
    height: 40,
    position: "absolute",
    backgroundColor: "transparent",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
