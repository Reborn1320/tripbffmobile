import React from "react";
import { Text, Card, CardItem, Left, Button, Right, Picker, Icon } from "native-base";
import { TouchableHighlight, Dimensions } from "react-native";
import Location3Images from "./Location3Images";
import LocationImage from "./LocationImage";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";

interface IMapDispatchToProps {
    toLocationDetailHandler?: (locationId: string) => void
    removeLocationHandler?: (dateIdx: number, locationId: string) => void
    openUpdateFeelingModalHandler?: (dateIdx: number, locationId: string) => void;
    openUpdateActivityModalHandler?: (dateIdx: number, locationId: string) => void;
}

export interface Props extends IMapDispatchToProps {
    tripId: string,
    dateIdx: number,
    location: StoreData.LocationVM,
}

export interface State {
    isAddFeelingModalVisible: boolean,
    isAddActivityModalVisible: boolean
}

class LocationItemComponent extends React.Component<Props, State> { 
    constructor(props) {
        super(props)

        this.state = {
            isAddFeelingModalVisible: false,
            isAddActivityModalVisible: false
        }
    } 

    _openUpdateFeelingModal = () => {
        this.props.openUpdateFeelingModalHandler(this.props.dateIdx, this.props.location.locationId);
    }

    _openUpdateActivityModal= () => {
        this.props.openUpdateActivityModalHandler(this.props.dateIdx, this.props.location.locationId);
    }

    render() {

        var location: StoreData.LocationVM = this.props.location;
        const nImages = location.images.length;

        const MARGIN_LEFT = 10
        const MARGIN_RIGHT = 10
        const SIZE = Dimensions.get('window').width - MARGIN_LEFT - MARGIN_RIGHT;
        const SIZE23 = SIZE * 2 / 3

        var feelingLabel = location.feeling && location.feeling.label ? location.feeling.label : "";
        var feelingIcon = location.feeling && location.feeling.icon ? location.feeling.icon : "smile";
        var activityLabel = location.activity && location.activity.label ? location.activity.label : "Activity";
        var activityIcon = location.activity && location.activity.icon ? location.activity.icon : "running";

        return (
            <Card style={{ marginLeft: MARGIN_LEFT, marginRight: MARGIN_RIGHT }}
            >
                <CardItem cardBody
                    style={{ backgroundColor: "white", height: 46, paddingLeft: 10 }}
                >
                    <Text style={{ 
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 10 }}>{location.location.address}</Text>
                </CardItem>

                <CardItem cardBody
                    style={{ backgroundColor: "white" }}
                >
                {/* todo icon x button with confirmation modal */}

                    <TouchableHighlight
                        style={{ width: SIZE, height: SIZE23, flex: 1 }}
                        onPress={() => this.props.toLocationDetailHandler(this.props.location.locationId)}

                    >
                        {(nImages == 0 || nImages == 1) ? (<LocationImage images={location.images} />)
                            : (nImages == 2) ? (<LocationImage images={location.images} />) : (<Location3Images images={location.images} />)}
                    </TouchableHighlight>

                </CardItem>
                <Button rounded icon transparent danger small
                        style={{ position: "absolute", right: 0, top: 6, backgroundColor: "white" }}
                        onPress={() => this.props.removeLocationHandler(this.props.dateIdx, this.props.location.locationId)}
                        >
                        <Icon name="times" type="FontAwesome5" />
                </Button>
                <CardItem>
                    {/* todo icon x button with confirmation modal */}
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
    var { tripId, locationId, dayIdx } = ownProps;
    var trip = _.find(storeState.trips, (item) => item.tripId == tripId);
    var dateVm = _.find(trip.dates, (item) => item.dayIdx == dayIdx);
    var location = _.find(dateVm.locations, (item) => item.locationId == locationId);

    return {
        tripId: tripId,
        dateIdx: dayIdx,
        location: location
    };
};

const LocationItem = connect(
    mapStateToProps,
    null
)(LocationItemComponent);

export default LocationItem;