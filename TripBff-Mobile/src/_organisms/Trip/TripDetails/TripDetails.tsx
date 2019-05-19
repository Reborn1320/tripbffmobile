import React, { Component } from "react";
import { Spinner, View } from 'native-base';
import { FlatList } from "react-native";
import _, { } from "lodash";
import DayItem from "../../../_molecules/Trip/DayItem/DayItem";
import EditPopupMenu from "../../../_molecules/Trip/EditPopupMenu/EditPopupMenu";
import moment from "moment";
import { StoreData } from "../../../store/Interfaces";
import { connect } from "react-redux";
import TripName from "../../../_molecules/Trip/TripName";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";

interface IMapDispatchToProps {
    openUpdateFeelingModalHandler?: (dateIdx: number, locationId: string) => void;
    openUpdateActivityModalHandler?: (dateIdx: number, locationId: string) => void;
    openRemoveLocationModalHandler?: (dateIdx: number, locationId: string) => void;
    openAddLocationModalHandler?: (dateIdx: number, date: moment.Moment) => void;
    openEditDateRangeModalHandler?: () => void;
    openEditTripNameModalHandler?: () => void;
}

export interface Props extends IMapDispatchToProps, PropsBase {
    tripId: string,
    tripName?: string
    tripFromDate?: moment.Moment
    tripToDate?: moment.Moment
}

interface State {
    isEditDateRangeModalVisible: boolean,
    isEditNameModalVisible: boolean,
    isLoaded: boolean
}

export interface DayVM {
    idx: number,
    date?: moment.Moment
}

export class TripDetailsComponent extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            isEditDateRangeModalVisible: false,
            isEditNameModalVisible: false,
            isLoaded: true
        }
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        var isUpdate = this.props.tripId != nextProps.tripId ||
            this.props.tripFromDate != nextProps.tripFromDate ||
            this.props.tripToDate != nextProps.tripToDate;
        return isUpdate;
    }

    onPopupMenuSelect = (value) => {
        console.log(`Selected number: ${value}`);
        switch (value) {
            case 1:
                this.props.openEditDateRangeModalHandler();
                break;
            case 2:
                this.props.openEditTripNameModalHandler();
                break;
            default:
                break;
        }
    }
   
    _renderItem = (itemInfo) => {
        const day: DayVM = itemInfo.item;
        return (
            <DayItem tripId={this.props.tripId} dateIdx={day.idx} navigation={this.props.navigation}
                openUpdateFeelingModalHandler={this.props.openUpdateFeelingModalHandler}
                openUpdateActivityModalHandler={this.props.openUpdateActivityModalHandler} 
                openRemoveLocationModalHandler={this.props.openRemoveLocationModalHandler}
                openAddLocationModalHandler={this.props.openAddLocationModalHandler}/>
        )
    };

    render() {
        const { isLoaded } = this.state;
        const { tripFromDate, tripToDate } = this.props;
        const nDays = tripToDate.diff(tripFromDate, "days") + 1;
        var dayVMs: DayVM[] = [];

        for (let idx = 0; idx < nDays; idx++) {
            dayVMs.push({
                idx: idx + 1                      
            })
        }

        return (
            <View>
                <View style={{
                    // ...mixins.themes.debug1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                    marginBottom: 10,
                }}>
                   <TripName tripId={this.props.tripId}/>
                   <EditPopupMenu onSelect={this.onPopupMenuSelect} />
                </View>

                {!isLoaded && <Spinner color='green' />}
                {isLoaded &&   
                    <FlatList
                        // styles={styles.container}
                        data={dayVMs}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => String(index)}
                    />
                }      

            </View>
        );
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    var tripId = ownProps.tripId;

    var trip = storeState.currentTrip;
    return {
        tripId: trip.tripId,
        tripFromDate: trip.fromDate,
        tripToDate: trip.toDate
    };
};

const TripDetails = connect(
    mapStateToProps,
    null
)(TripDetailsComponent);

export default TripDetails;

