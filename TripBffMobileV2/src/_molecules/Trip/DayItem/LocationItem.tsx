import React, { Component } from "react";
import { Text, Card, CardItem, Left, Button, Right, Icon } from "native-base";
import { TouchableOpacity, View, StyleSheet, ViewStyle, TextStyle } from "react-native";
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
            <View style={{ marginBottom: 20 }}>
                <View style={styles.locationNameContainer}>
                    <Icon
                        style={styles.locationName_MapIcon}
                        name="map-marker-alt" type="FontAwesome5" />
                    <TouchableOpacity style={styles.locationName_Name} onPress={this._toLocationDetail}>
                        <Text>{location.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._openRemoveLocationModal}>
                        <Icon style={styles.locationName_CloseIcon} name="times" type="FontAwesome5" />
                    </TouchableOpacity>
                </View>

                <CarouselItem
                    images={locationImages}
                    toLocationDetailsHanlder={this._toLocationDetail}>
                </CarouselItem>

                <CardItem>
                    <Left>
                        <Button primary transparent onPress={this._openUpdateFeelingModal}>
                            <Icon name={feelingIcon} type="FontAwesome5" />
                            {
                                feelingLabel && <Text>{getLabel("trip_detail.feeling_adjective")} {feelingLabel} </Text>    ||
                                                <Text>{getLabel("trip_detail.feeling_label")} </Text>                            
                            }      
                                                  
                        </Button>                         
                    </Left>
                    <Right>
                        <Button primary transparent onPress={this._openUpdateActivityModal}>
                            <Icon name={activityIcon} type="FontAwesome5"/>     
                            <Text>{activityLabel} </Text> 
                        </Button>
                    </Right>
                </CardItem>                
            </View>            
        );
    }
}


interface Style {
    locationNameContainer: ViewStyle;
    locationName_MapIcon: TextStyle;
    locationName_Name: TextStyle;
    locationName_CloseIcon: TextStyle;
}

const styles = StyleSheet.create<Style>({
    locationNameContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 5,
        paddingBottom: 5,
        marginLeft: 10,
        marginRight: 10,
    },
    locationName_MapIcon: {
        fontSize: 20,
    },
    locationName_Name: {
        fontSize: 16,
        fontFamily: "Roboto",
        marginLeft: 10,
        marginRight: 10,
        flexGrow: 1,
    },
    locationName_CloseIcon: {
        fontSize: 20,
        marginRight: 5,
    }
});


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