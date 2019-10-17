import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

const checkIcon = require('./circle-check.png');

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'transparent',
  },
});

class ImageItem extends Component {
  componentWillMount() {
    let { width } = Dimensions.get('window');
    const { imageMargin, imagesPerRow, containerWidth } = this.props;

    if (typeof containerWidth !== 'undefined') {
      width = containerWidth;
    }
    this.imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow;
  }

  handleClick(item) {
    this.props.onClick(item);
  }

  render() {
    const {
      item, selected, selectedMarker, imageMargin,
    } = this.props;

    const marker = selectedMarker || (<Image
      style={[styles.marker, { width: 25, height: 25 }]}
      source={checkIcon}
    />);

    const { image } = item.node;

    return (
      <TouchableOpacity
        style={{ marginBottom: imageMargin, marginRight: imageMargin }}
        onPress={() => this.handleClick(image)}
      >
        {
          Platform.OS === 'ios' && 
          <Image
            source={{ uri: image.uri }}
            style={{ height: this.imageSize, width: this.imageSize }}
          /> ||
          <FastImage
            source={{ uri: image.uri }}
            style={{ height: this.imageSize, width: this.imageSize }}
          />
        }
        
        {(selected) ? marker : null}
      </TouchableOpacity>
    );
  }
}

ImageItem.defaultProps = {
  item: {},
  selected: false,
};

ImageItem.propTypes = {
  item: PropTypes.object,
  selected: PropTypes.bool,
  selectedMarker: PropTypes.element,
  imageMargin: PropTypes.number,
  imagesPerRow: PropTypes.number,
  onClick: PropTypes.func,
};

export default ImageItem;