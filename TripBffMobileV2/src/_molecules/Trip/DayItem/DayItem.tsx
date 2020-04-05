import React, { Component } from 'react'
import { View, Text, Button, Icon } from 'native-base';
import LocationItem from './LocationItem';
import moment from 'moment';
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";
import { PropsBase } from '../../../screens/_shared/LayoutContainer';
import { StyleSheet, TextStyle, ViewStyle, ImageStyle, Platform } from 'react-native';
import NBColor from "../../../theme/variables/commonColor.js";
import EmptyLocationItem from "./EmptyLocation";
import { TouchableOpacity, Image } from 'react-native';
import { mixins } from '../../../_utils';
import { withNamespaces } from 'react-i18next';
import 'moment/locale/vi';

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
    dateVm?: StoreData.DateVM,
    locale?: string,
    canContribute: boolean
}

export interface State {
}

export class DayItemComponent extends Component<Props, State> {

    _openAddLocationModal = () => {
        this.props.openAddLocationModalHandler(this.props.dateIdx, this.props.date.clone());
    }

    render() {
        const { dateIdx, dateVm, t, canContribute } = this.props;
        let android9Style = Platform.OS === 'android' && Platform.Version === 28 ? styles.dayItemContainerAndroid9 : {};

        return (
            <View style={[styles.dayItemContainer, android9Style]}>
                <View style={styles.dayItemHeader}>
                    <Text style={styles.dayLabel}>
                        {t("trip_detail:day_label")} {dateIdx} - {t("common:date_format", { date: this.props.date })}
                    </Text>
                    {
                        canContribute && this.props.locationIds.length > 0 &&
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
                        canContribute={canContribute}
                        location={_.find(dateVm.locations, (item) => item.locationId == e)}
                        navigation={this.props.navigation}
                        locale={this.props.locale}
                        removeLocationHandler={this.props.openRemoveLocationModalHandler}
                        openUpdateFeelingModalHandler={this.props.openUpdateFeelingModalHandler}
                        openUpdateActivityModalHandler={this.props.openUpdateActivityModalHandler}>
                    </LocationItem>)
                }

                {
                    this.props.locationIds.length == 0 &&
                    (
                        <EmptyLocationItem
                            canContribute={canContribute}
                            viewContainerStyle={styles.emptyContainer}
                            subTitle={canContribute ? t("message:add_location") : t("message:no_location")}
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
        dateVm,
        locale: storeState.user.locale
    };
};

const DayItem = connect(
    mapStateToProps,
    null
)(DayItemComponent);

export default withNamespaces(['message', 'trip_detail', 'common'])(DayItem);

interface Style {
    dayItemContainer: ViewStyle;
    dayItemContainerAndroid9: ViewStyle;
    dayItemHeader: TextStyle;
    dayLabel: TextStyle;
    addLocationIcon: ImageStyle;
    emptyContainer: ViewStyle;
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
    dayItemContainerAndroid9: {
        backgroundColor: "#fff"
    },
    dayItemHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        flexDirection: "row",
        marginTop: 16
    },
    dayLabel: {
        color: NBColor.brandPrimary,
        fontSize: 16,
        ...mixins.themes.fontBold,
        fontStyle: "normal",
        lineHeight: 20,
        marginLeft: 12
    },
    addLocationIcon: {
        marginRight: 12
    },
    emptyContainer: {
        backgroundColor: '#F9F9F9',
        borderRadius: 6,
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
        marginTop: 16,
        marginBottom: 16,
        height: 150,
        justifyContent: "center",
        alignItems: "center"
    },
});
