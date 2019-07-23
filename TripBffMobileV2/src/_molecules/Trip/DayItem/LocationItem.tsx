import React, { Component } from "react";
import { Text, Card, CardItem, Left, Button, Right, Icon } from "native-base";
import { TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";
import { NavigationConstants } from "../../../screens/_shared/ScreenConstants";
import CarouselItem from "../DayItem/CarouselItem";
import { getLabel } from "../../../../i18n";

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
    isAddActivityModalVisible: boolean
}

class LocationItemComponent extends Component<Props, State> { 
    constructor(props) {
        super(props)

        this.state = {
            isAddFeelingModalVisible: false,
            isAddActivityModalVisible: false
        }
    } 

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
        var { tripId, dateIdx, location: { locationId }  } = this.props;
        this.props.navigation.navigate(NavigationConstants.Screens.LocationDetails, { tripId, locationId, dateIdx })
    }   

    render() {

        var location: StoreData.LocationVM = this.props.location;

        const MARGIN_LEFT = 10
        const MARGIN_RIGHT = 10

        var feelingLabel = location.feeling && location.feeling.label ? location.feeling.label : "";
        var feelingIcon = location.feeling && location.feeling.icon ? location.feeling.icon : "smile";
        var activityLabel = location.activity && location.activity.label ? location.activity.label : getLabel("trip_detail.activity_label");
        var activityIcon = location.activity && location.activity.icon ? location.activity.icon : "running";        

        let locationImages = [];

        if (location.images.length == 0) {
            locationImages.push({
                thumbnailExternalUrl: ""
            });
        }
        else {
            locationImages = location.images.filter(item => item.isFavorite);
        
            if (locationImages.length == 0) {
                locationImages = location.images.length > 3 ? location.images.slice(0, 3) : location.images;
            }
        }

        return (
            <View style={{ marginLeft: MARGIN_LEFT, marginRight: MARGIN_RIGHT }}>
                <TouchableOpacity onPress={this._toLocationDetail}>
                    <CardItem cardBody
                            style={{ backgroundColor: "white", height: 46, paddingLeft: 10 }}>
                        <Text style={{ 
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 10 }}
                            >{location.name}</Text>
                    </CardItem>
                </TouchableOpacity>
                

                <Button rounded icon transparent danger small
                        style={{ position: "absolute", right: 0, top: 6, backgroundColor: "white" }}
                        onPress={this._openRemoveLocationModal}
                        >
                        <Icon name="times" type="FontAwesome5" />
                </Button>                              

                <CarouselItem
                    images={locationImages}
                    toLocationDetailsHanlder={this._toLocationDetail}>
                </CarouselItem>

                <CardItem>
                    <Left>
                        <Button transparent onPress={this._openUpdateFeelingModal}>
                            <Icon name={feelingIcon} type="FontAwesome5" />
                            {
                                feelingLabel && <Text>{getLabel("trip_detail.feeling_adjective")} {feelingLabel} </Text>    ||
                                                <Text>{getLabel("trip_detail.feeling_label")} </Text>                            
                            }      
                                                  
                        </Button>                         
                    </Left>
                    <Right>
                        <Button transparent onPress={this._openUpdateActivityModal}>
                            <Icon name={activityIcon} type="FontAwesome5"/>     
                            <Text>{activityLabel} </Text> 
                        </Button>
                    </Right>
                </CardItem>                
            </View>            
        );
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
    var { tripId, locationId, dateIdx } = ownProps;
    var dateVm = _.find(storeState.currentTrip.dates, (item) => item.dateIdx == dateIdx);
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