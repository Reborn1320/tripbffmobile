import React from 'react'
import { View, Text, Button, Icon } from 'native-base';
import LocationItem from './LocationItem';
import moment from 'moment';
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";

interface IMapDispatchToProps {
    openUpdateFeelingModalHandler?: (dateIdx: number, locationId: string) => void;
    openUpdateActivityModalHandler?: (dateIdx: number, locationId: string) => void;
    openRemoveLocationModalHandler?: (dateIdx: number, locationId: string) => void;
    openAddLocationModalHandler?: (dateIdx: number, date: moment.Moment) => void;
}

export interface Props extends IMapDispatchToProps {
    tripId: string
    locationIds?: Array<number>
    dayIdx: number
    date: moment.Moment
}

export interface State {
}

export class DayItemComponent extends React.Component<Props, State> {

    _openAddLocationModal = () => {
        this.props.openAddLocationModalHandler(this.props.dayIdx, this.props.date);
    }

    render() {
        const { dayIdx } = this.props

        return (
            <View>
                <View style={{display: "flex", alignItems: "stretch", flexDirection: "row", paddingLeft: 10, paddingRight: 10}}>
                    <Text style={{color: "darkred", fontSize: 20}}>Day {dayIdx}</Text>
                    <Button small transparent
                            onPress= {this._openAddLocationModal}>
                        <Icon type={"FontAwesome"} name="plus" />
                    </Button>
                </View>

                {this.props.locationIds.map(e => 
                    <LocationItem tripId={this.props.tripId} dayIdx={dayIdx} locationId={e} key={e}
                        openUpdateFeelingModalHandler={this.props.openUpdateFeelingModalHandler}
                        openUpdateActivityModalHandler={this.props.openUpdateActivityModalHandler}>
                    </LocationItem>)
                }

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

const DayItem = connect(
    mapStateToProps,
    null
)(DayItemComponent);

export default DayItem;
