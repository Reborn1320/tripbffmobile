import React from 'react'
import { View, Text, Button, Icon } from 'native-base';
import LocationItem from './LocationItem';
import moment from 'moment';
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";
import AddLocationModal from "../../../_organisms/Trip/TripDetails/AddLocationModal";
import { addLocation } from "../../../store/Trip/operations";

interface IMapDispatchToProps {
    addLocation?: (tripId: string, location: StoreData.LocationVM) => Promise<void>;
    openUpdateFeelingModalHandler?: (locationId: string) => void;
    openUpdateActivityModalHandler?: (locationId: string) => void;
}

export interface Props extends IMapDispatchToProps {
    tripId: string
    locationIds?: Array<number>
    dayIdx: number
    date: moment.Moment
}

export interface State {
    isAddLocationModalVisible: boolean
}

export class DayItemComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            isAddLocationModalVisible: false
        }
    }


    _addLocationModal() {
        this.setState({
            isAddLocationModalVisible: true
        });
    }

    _addLocationConfirmed = (address, fromTime) => {
        this.setState({
            isAddLocationModalVisible: false
        });

        this.props.addLocation(address, fromTime);
    }

    _cancelAddLocationModal = () => {
        this.setState({
            isAddLocationModalVisible: false
        });
    }


    render() {
        const { dayIdx, date } = this.props
        const { isAddLocationModalVisible } = this.state

        return (
            <View>
                <View style={{display: "flex", alignItems: "stretch", flexDirection: "row", paddingLeft: 10, paddingRight: 10}}>
                    <Text style={{color: "darkred", fontSize: 20}}>Day {dayIdx}</Text>
                    <Button small transparent
                            onPress= {() => this._addLocationModal()}>
                        <Icon type={"FontAwesome"} name="plus" />
                    </Button>
                </View>

                {this.props.locationIds.map(e => 
                    <LocationItem tripId={this.props.tripId} dayIdx={dayIdx} locationId={e} key={e}
                        openUpdateFeelingModalHandler={this.props.openUpdateFeelingModalHandler}
                        openUpdateActivityModalHandler={this.props.openUpdateActivityModalHandler}>
                    </LocationItem>)
                }

                <AddLocationModal
                    isVisible={isAddLocationModalVisible}
                    date={date}
                    confirmHandler={this._addLocationConfirmed}
                    cancelHandler={this._cancelAddLocationModal} />
            </View>
        )
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    var tripId = ownProps.tripId;
    var trip = _.find(storeState.trips, (item) => item.tripId == tripId);
    var dateVm = trip.dates.find(d => d.dayIdx == d.dayIdx);

    return {
        tripId: tripId,
        locationIds: dateVm.locationIds
    };
};

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
    return {
        addLocation: (tripId, location) => dispatch(addLocation(tripId, location)),
    };
};

const DayItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(DayItemComponent);

export default DayItem;
