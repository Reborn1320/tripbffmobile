import React, { Component } from "react";
import { Text, Card, CardItem, Left, Button, Right, Icon, View, Body } from "native-base";
import { Dimensions } from "react-native";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from './SliderEntry'
import styles from './SliderEntry.styles';
import { colors } from './index.style';

const SLIDER_1_FIRST_ITEM = 0;

interface IMapDispatchToProps {
    removeLocationHandler?: (dateIdx: number, locationId: string) => void
    openUpdateFeelingModalHandler?: (dateIdx: number, locationId: string) => void;
    openUpdateActivityModalHandler?: (dateIdx: number, locationId: string) => void;
}

export interface Props extends IMapDispatchToProps, PropsBase {
    tripId: string,
    dateIdx: number,
    location: StoreData.LocationVM,
}

export interface State {
    isAddFeelingModalVisible: boolean,
    isAddActivityModalVisible: boolean,
    slider1ActiveSlide: number
}

class LocationItemComponent extends Component<Props, State> { 
    constructor(props) {
        super(props)

        this.state = {
            isAddFeelingModalVisible: false,
            isAddActivityModalVisible: false,
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        }
    } 

    _slider1Ref;

    _openRemoveLocationModal = () => {
        this.props.removeLocationHandler(this.props.dateIdx, this.props.location.locationId)
    }

    _openUpdateFeelingModal = () => {
        this.props.openUpdateFeelingModalHandler(this.props.dateIdx, this.props.location.locationId);
    }

    _openUpdateActivityModal= () => {
        this.props.openUpdateActivityModalHandler(this.props.dateIdx, this.props.location.locationId);
    }

    _toLocationDetail = () => {
        var locationId = this.props.location.locationId;
        this.props.navigation.navigate("LocationDetail", { tripId: this.props.tripId, locationId })
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={false}
              parallaxProps={parallaxProps}
            />
        );
    }

    render() {

        var location: StoreData.LocationVM = this.props.location;
        const nImages = location.images.length;

        const MARGIN_LEFT = 10
        const MARGIN_RIGHT = 10
        const SIZE = Dimensions.get('window').width - MARGIN_LEFT - MARGIN_RIGHT;
 
        var feelingLabel = location.feeling && location.feeling.label ? location.feeling.label : "";
        var feelingIcon = location.feeling && location.feeling.icon ? location.feeling.icon : "smile";
        var activityLabel = location.activity && location.activity.label ? location.activity.label : "Activity";
        var activityIcon = location.activity && location.activity.icon ? location.activity.icon : "running";

        const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

        function wp (percentage) {
            const value = (percentage * viewportWidth) / 100;
            return Math.round(value);
        }

        const slideWidth = wp(75);
        const itemHorizontalMargin = wp(2);
        const itemWidth = slideWidth + itemHorizontalMargin * 2;
        const sliderWidth = viewportWidth;

        return (
            <Card style={{ marginLeft: MARGIN_LEFT, marginRight: MARGIN_RIGHT }}>
                <CardItem cardBody
                    style={{ backgroundColor: "white", height: 46, paddingLeft: 10 }}>
                    <Text style={{ 
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 10 }}>{location.location.address}</Text>
                </CardItem>

                <Button rounded icon transparent danger small
                        style={{ position: "absolute", right: 0, top: 6, backgroundColor: "white" }}
                        onPress={this._openRemoveLocationModal}
                        >
                        <Icon name="times" type="FontAwesome5" />
                </Button>

                <CardItem cardBody>
                    <Carousel       
                        ref={c => this._slider1Ref = c}             
                        data={location.images}
                        renderItem={this._renderItemWithParallax}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        firstItem={SLIDER_1_FIRST_ITEM}
                        onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                     /> 
                   </CardItem>

                <CardItem cardBody style={{ justifyContent:"center" }}>
                        <Pagination 
                                dotsLength={location.images.length}
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

                <CardItem>
                    <Left>
                        <Button transparent onPress={this._openUpdateFeelingModal}>
                            <Icon name={feelingIcon} type="FontAwesome5" /> 
                            <Text>Feeling {feelingLabel} </Text>                       
                        </Button>                         
                    </Left>
                    <Right>
                        <Button transparent onPress={this._openUpdateActivityModal}>
                            <Icon name={activityIcon} type="FontAwesome5"/>     
                            <Text>{activityLabel} </Text> 
                        </Button>
                    </Right>
                </CardItem>                
            </Card>            
        );
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
    var { tripId, locationId, dateIdx } = ownProps;
    var trip = _.find(storeState.trips, (item) => item.tripId == tripId);
    var dateVm = _.find(trip.dates, (item) => item.dateIdx == dateIdx);
    var location = _.find(dateVm.locations, (item) => item.locationId == locationId);

    return {
        tripId: tripId,
        dateIdx: dateIdx,
        location: location
    };
};

const LocationItem = connect(
    mapStateToProps,
    null
)(LocationItemComponent);

export default LocationItem;