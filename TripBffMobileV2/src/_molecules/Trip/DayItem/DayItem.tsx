import React, { Component } from 'react'
import { View, Text, Button, Icon } from 'native-base';
import LocationItem from './LocationItem';
import moment from 'moment';
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";
import { PropsBase } from '../../../screens/_shared/LayoutContainer';
import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { getLabel } from "../../../../i18n";
import NBTheme from "../../../theme/variables/material.js";
import EmptyLocationItem from "./EmptyLocation";
import { DATE_FORMAT } from "../../../screens/_services/SystemConstants";
import { TouchableOpacity, Image } from 'react-native';
import { mixins } from '../../../_utils';

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
    dateVm?: StoreData.DateVM
}

export interface State {
}

export class DayItemComponent extends Component<Props, State> {

    _openAddLocationModal = () => {
        this.props.openAddLocationModalHandler(this.props.dateIdx, this.props.date.clone());
    }

    render() {
        const { dateIdx, dateVm } = this.props
        let currentDate = moment(this.props.date).startOf("day").format(DATE_FORMAT);

        return (
            <View style={styles.dayItemContainer}>
                <View style={styles.dayItemHeader}>
                    <Text style={styles.dayLabel}>
                        {getLabel("trip_detail.day_label")} {dateIdx} - {currentDate}
                    </Text>
                    {
                        this.props.locationIds.length > 0 &&
                        <TouchableOpacity onPress= {this._openAddLocationModal}>
                             <Image
                                style={styles.addLocationIcon}
                                source={require('../../../../assets/AddLocation.png')}
                            />
                        </TouchableOpacity>
                    }
                 </View>

                {this.props.locationIds.length > 0 && this.props.locationIds.map(e => 
                    <LocationItem tripId={this.props.tripId} dateIdx={dateIdx} key={e}
                        location={_.find(dateVm.locations, (item) => item.locationId == e)}
                        navigation={this.props.navigation}
                        removeLocationHandler={this.props.openRemoveLocationModalHandler}
                        openUpdateFeelingModalHandler={this.props.openUpdateFeelingModalHandler}
                        openUpdateActivityModalHandler={this.props.openUpdateActivityModalHandler}>
                    </LocationItem>)
                }

                {
                    this.props.locationIds.length == 0 &&
                    (
                        <EmptyLocationItem  
                            openAddLocationModalHandler={this._openAddLocationModal}
                            >
                        </EmptyLocationItem>
                    )
                }
            </View>
        )
    }
}

//todo DO NOT MAP DATA DIRECT FROM REDUX, shoul pass data from higher level component --> Reborn: WHY ???
const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    var tripId = ownProps.tripId;
    var dateVm = storeState.currentTrip.dates.find(d => d.dateIdx == ownProps.dateIdx);

    return {
        tripId: tripId,
        locationIds: dateVm.locationIds,
        date: dateVm.date,
        dateVm
    };
};

const DayItem = connect(
    mapStateToProps,
    null
)(DayItemComponent);

export default DayItem;

interface Style {
    dayItemContainer: ViewStyle;
    dayItemHeader: TextStyle;
    dayLabel: TextStyle;
    addLocationIcon: ImageStyle;
}

const styles = StyleSheet.create<Style>({
    dayItemContainer: {        
        margin: 12,
        shadowColor: "rgba(0, 0, 0, 0.07)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 1,
        elevation: 0.7,
        borderRadius: 4
    },
    dayItemHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        flexDirection: "row",
        marginTop: 16
    },
    dayLabel: {
        color: NBTheme.brandPrimary,
        fontSize: 14,
        ...mixins.themes.fontBold,
        fontStyle: "normal",
        lineHeight: 20,
        marginLeft: 12
    },
    addLocationIcon: {
        marginRight: 12
    }
});
