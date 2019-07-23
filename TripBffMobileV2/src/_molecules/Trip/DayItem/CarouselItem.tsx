import React, { PureComponent } from 'react'
import { CardItem } from "native-base";
import { Dimensions, TouchableOpacity, View } from "react-native";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from './SliderEntry'
import styles, { colors } from './index.style';

interface IMapDispatchToProps {
    toLocationDetailsHanlder: () => void
}

export interface Props extends IMapDispatchToProps {
    images: Array<StoreData.ImportImageVM>
}

export interface State {
    slider1ActiveSlide: number
}

const SLIDER_1_FIRST_ITEM = 0;

export default class CarouselItem extends PureComponent<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        }
    }

    _slider1Ref;

    _renderItemWithParallax = ({item, index}, parallaxProps) => {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={false}
              parallaxProps={parallaxProps}
              toLocationDetailsHanlder={this.props.toLocationDetailsHanlder}
            />
        );
    }

    render() {

        const { width: wpWidth } = Dimensions.get('window');

        const viewportWidth = wpWidth - 30;

        const itemWidth = viewportWidth;
        const sliderWidth = viewportWidth;

        return (
            <View>
                <TouchableOpacity onPress={this.props.toLocationDetailsHanlder}>
                    {/* <CardItem cardBody> */}
                        <Carousel       
                                ref={c => this._slider1Ref = c}             
                                data={this.props.images}
                                renderItem={this._renderItemWithParallax}
                                sliderWidth={sliderWidth}
                                itemWidth={itemWidth}
                                firstItem={SLIDER_1_FIRST_ITEM}
                                slideStyle={{ width: viewportWidth }}
                                hasParallaxImages={false}                                
                                inactiveSlideScale={0.94}
                                inactiveSlideOpacity={0.7}
                                enableMomentum={true}
                                decelerationRate={0.9}
                                containerCustomStyle={styles.slider}
                                contentContainerCustomStyle={styles.sliderContentContainer}                               
                                onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                            /> 
                    {/* </CardItem>   */}
                </TouchableOpacity>                 
        
                <TouchableOpacity onPress={this.props.toLocationDetailsHanlder}>
                        <CardItem cardBody style={{ justifyContent:"center" }}>
                            <Pagination 
                                    dotsLength={this.props.images.length}
                                    activeDotIndex={this.state.slider1ActiveSlide}
                                    containerStyle={styles.paginationContainer}
                                    dotColor={'rgba(64, 130, 237, 0.92)'}
                                    dotStyle={styles.paginationDot}
                                    inactiveDotColor={colors.black}
                                    inactiveDotOpacity={0.4}
                                    inactiveDotScale={0.6}
                                    carouselRef={this._slider1Ref}
                                    tappableDots={!!this._slider1Ref}
                                />                    
                        </CardItem>   
                    </TouchableOpacity>             
            </View>
             
        )
    }
}
