import React, { Component } from 'react'
import { View, Text, Button, Icon } from 'native-base';
import LocationItem from './LocationItem';
import moment from 'moment';
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";
import { PropsBase } from '../../../screens/_shared/LayoutContainer';

interface IMapDispatchToProps {
    openUpdateFeelingModalHandler?: (dateIdx: number, locationId: string) => void;
    openUpdateActivityModalHandler?: (dateIdx: number, locationId: string) => void;
    openRemoveLocationModalHandler?: (dateIdx: number, locationId: string) => void;
    openAddLocationModalHandler?: (dateIdx: number, date: moment.Moment) => void;
}

export interface Props extends IMapDispatchToProps, PropsBase {
    tripId: string
    locationIds?: Array<string>
    dateIdx: number
    date?: moment.Moment
}

export interface State {
}

export class DayItemComponent extends Component<Props, State> {

    _openAddLocationModal = () => {
        this.props.openAddLocationModalHandler(this.props.dateIdx, this.props.date.clone());
    }

    render() {
        const { dateIdx } = this.props
        let currentDate = moment(this.props.date).startOf("day").format('MMMM DD, YYYY');

        return (
            <View>
                <View style={{display: "flex", alignItems: "stretch", flexDirection: "row", paddingLeft: 10, paddingRight: 10}}>
                    <Text style={{color: "darkred", fontSize: 20}}>Day {dateIdx} - {currentDate}</Text>
                    <Button small transparent
                            onPress= {this._openAddLocationModal}>
                        <Icon type={"FontAwesome"} name="plus" />
                    </Button>
                </View>

                {this.props.locationIds.length > 0 && this.props.locationIds.map(e => 
                    <LocationItem tripId={this.props.tripId} dateIdx={dateIdx} locationId={e} key={e}
                        navigation={this.props.navigation}
                        removeLocationHandler={this.props.openRemoveLocationModalHandler}
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
    var dateVm = trip.dates.find(d => d.dateIdx == ownProps.dateIdx);

    return {
        tripId: tripId,
        locationIds: dateVm.locationIds,
        date: dateVm.date
    };
};

const DayItem = connect(
    mapStateToProps,
    null
)(DayItemComponent);

export default DayItem;
