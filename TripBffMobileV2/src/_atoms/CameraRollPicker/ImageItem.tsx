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

interface Props {
  item: any,
  selected: boolean,
  selectedMarker: any,
  imageMargin: number,
  imagesPerRow: number,
  onClick: any,
  containerWidth: number
}

interface State {
  imageSize: number
}

class ImageItem extends Component<Props, State> {
  
  constructor(props) {
    super(props);

    this.state = {
      imageSize: 0
    }
  }

  componentDidMount() {
    const imageSize = this._calculateImageSize();    
    this.setState({ imageSize: imageSize });
  }

  private _calculateImageSize = () => {
    let { width } = Dimensions.get('window');
    const { imageMargin, imagesPerRow, containerWidth } = this.props;

    if (typeof containerWidth !== 'undefined') {
      width = containerWidth;
    }
    let imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow;
    return imageSize;
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
    const { imageSize } = this.state;    

    return (
      <TouchableOpacity
        style={{ marginBottom: imageMargin, marginRight: imageMargin }}
        onPress={() => this.handleClick(image)}
      >
        {
          Platform.OS === 'ios' && 
          <Image
            source={{ uri: image.uri }}
            style={{ height: imageSize, width: imageSize }}
          /> ||
          <FastImage
            source={{ uri: image.uri }}
            style={{ height: imageSize, width:imageSize }}
          />
        }
        
        {(selected) ? marker : null}
      </TouchableOpacity>
    );
  }
}

export default ImageItem;