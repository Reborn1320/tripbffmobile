import React, { Component } from "react";
import { View } from "native-base";
import _ from "lodash";
import Carousel from 'react-native-snap-carousel';
import styles from './index.style';
import SliderEntry from './SliderEntry';
import { sliderWidth, itemWidth } from './SliderEntry.style';

export interface IStateProps { }

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
  entries: IEntry[],
  clickHandler: () => void;
}

interface State {
}

export type IEntry = {
  title?: string,
  subtitle?: string,
  illustration: string,
}

export class StyledCarousel extends Component<Props & IStateProps, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
    };
  }

  _renderItem = ({ item, index }) => {
    return <SliderEntry data={item} even={(index + 1) % 2 === 0} clickHandler={this.props.clickHandler} />;
  }

  _renderItemWithParallax = ({ item, index }, parallaxProps) => {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
        clickHandler={this.props.clickHandler}
      />
    );
  }

  _renderLightItem = ({ item }) => {
    return <SliderEntry data={item} even={false} clickHandler={this.props.clickHandler} />;
  }

  layoutExample = (type, entries: IEntry[]) => {
    const isTinder = type === 'tinder';
    return (
      <View style={[styles.exampleContainer, isTinder ? styles.exampleContainerDark : styles.exampleContainerLight]}>
        <Carousel
          data={isTinder ? entries : entries}
          renderItem={isTinder ? this._renderLightItem : this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          layout={type}
          loop={true}
        />
      </View>
    );
  }

  render() {
    const { entries } = this.props;

    const example4 = this.layoutExample("stack", entries);
    return (
      <View>
        {example4}
      </View>
    );
  }
}
