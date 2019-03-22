import React, { Component } from "react";
import { Spinner, View, H1, Icon } from 'native-base';
import { FlatList } from "react-native";
import _, { } from "lodash";
import DayItem from "../../../_molecules/Trip/DayItem/DayItem";
import * as RNa from "react-navigation";
import ConfirmationModal from "../../../_molecules/ConfirmationModal";
import EditPopupMenu from "../../../_molecules/Trip/EditPopupMenu/EditPopupMenu";
import { Modal } from "../../../_atoms";
import { TripEditForm, TripEditFormEnum } from "../../TripEditForm/TripEditForm";
import moment, { Moment } from "moment";
import { StoreData } from "../../../store/Interfaces";
import AddLocationModal from "./AddLocationModal";
import AddFeelingModal from "./AddFeelingModal";
import AddActivityModal from "./AddActivityModal";
import { removeLocation, updateTripDateRange, addLocation, updateLocationFeeling, updateLocationActivity, updateTripName } from "../../../store/Trip/operations";
import { connect } from "react-redux";
import { fetchTripLocations } from "../../../store/Trips/operations";
import { updateLocations } from "../../../store/Trip/actions";

interface IMapDispatchToProps {
    updateTripDateRange?: (tripId: string, fromDate: Moment, toDate: Moment) => Promise<StoreData.TripVM>;
    updateTripName?: (tripId: string, tripName: string) => Promise<StoreData.TripVM>;
    removeLocation?: (tripId: string, locationId: string) => Promise<void>
    fetchLocations?: (tripId: string) => Promise<Array<StoreData.LocationVM>>;    
    updateLocations?: (tripId: string, locations: Array<StoreData.LocationVM>) => Promise<void>;    
    openUpdateFeelingModalHandler?: (locationId: string) => void;
    openUpdateActivityModalHandler?: (locationId: string) => void;
}

export interface Props extends IMapDispatchToProps {
    tripId: string,
    tripName?: string
    tripFromDate?: moment.Moment
    tripToDate?: moment.Moment
}

interface State {
    modalVisible: boolean,
    isConfirmationModalVisible: boolean,
    focusingLocationId?: string,
    isEditDateRangeModalVisible: boolean,
    isEditNameModalVisible: boolean,
    isAddFeelingModalVisible: boolean,
    isAddActivityModalVisible: boolean,
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
            modalVisible: false,
            isConfirmationModalVisible: false,
            isEditDateRangeModalVisible: false,
            isEditNameModalVisible: false,
            isAddFeelingModalVisible: false,
            isAddActivityModalVisible: false,
            isLoaded: true
        }
    }

    removeLocation(locationId) {
        console.log("removeLocation")
        this.setState({
            isConfirmationModalVisible: true,
            focusingLocationId: locationId,
        });
    }

    onPopupMenuSelect = (value) => {
        console.log(`Selected number: ${value}`);
        switch (value) {
            case 1:
                this.setState({
                    isEditDateRangeModalVisible: true
                });
                break;
            case 2:
                this.setState({
                    isEditNameModalVisible: true
                });
                break;
            default:
                break;
        }
    }

    onEditDateRange = (tripName: string, fromDate: Moment, toDate: Moment) => {
        this.props.updateTripDateRange(this.props.tripId, fromDate, toDate)
            .then(newTrip => {
                this.setState({
                    isEditDateRangeModalVisible: false
                });
                //TODO: this.props.onRefresh();
            });
    }


    onEditTripName = (tripName: string, fromDate: Moment, toDate: Moment) => {
        this.props.updateTripName(this.props.tripId, tripName)
            .then(() => {
                this.setState({
                    isEditNameModalVisible: false
                });
                //TODO: this.props.onRefresh(); //todo move this refresh as chain reaction
            });
    }

    private closeEditDateRangeModal = () => {
        this.setState({ isEditDateRangeModalVisible: false });
    }
    private closeEditNameModal = () => {
        this.setState({ isEditNameModalVisible: false });
    }

    _removeLocationConfirmed = () => {
        let focusingLocationId = this.state.focusingLocationId;
        this.setState({
            isConfirmationModalVisible: false,
            focusingLocationId: null,
        });

        this.props.removeLocation(this.props.tripId, focusingLocationId);
    }

    _cancelModal = () => {
        this.setState({
            isConfirmationModalVisible: false,
            focusingLocationId: null,
        });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    
    _renderItem = (itemInfo) => {
        const day: DayVM = itemInfo.item;
        return (
            <DayItem tripId={this.props.tripId} dayIdx={day.idx} date={day.date} 
                openUpdateFeelingModalHandler={this.props.openUpdateFeelingModalHandler}
                openUpdateActivityModalHandler={this.props.openUpdateActivityModalHandler} />
        )
    };

    render() {
        const {
            isConfirmationModalVisible,
            isEditDateRangeModalVisible,
            isEditNameModalVisible,
            isLoaded } = this.state;
        const { tripName, tripFromDate, tripToDate } = this.props;
        const nDays = tripToDate.diff(tripFromDate, "days") + 1;
        var dayVMs: DayVM[] = [];

        for (let idx = 0; idx < nDays; idx++) {
            dayVMs.push({
                idx: idx + 1,
                date: tripFromDate.add(idx, 'days')                       
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
                    <H1 style={{
                        // ...mixins.themes.debug2,
                        fontSize: 40,
                        lineHeight: 50,
                        flexGrow: 9,
                        maxWidth: "90%",
                    }}>{tripName}</H1>
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

                <ConfirmationModal title="DELETE LOCATION" content="Do you want to delete this location ?"
                    confirmHandler={this._removeLocationConfirmed}
                    cancelHandler={this._cancelModal}
                    isVisible={isConfirmationModalVisible} />
                <Modal isVisible={isEditDateRangeModalVisible}
                    title="Edit date range"
                >
                    <TripEditForm
                        fields={[TripEditFormEnum.DateRange]}
                        fromDate={tripFromDate} toDate={tripToDate}
                        onClickEdit={this.onEditDateRange}
                        onCancel={this.closeEditDateRangeModal} />
                </Modal>
                <Modal isVisible={isEditNameModalVisible}
                    title="Edit trip name"
                >
                    <TripEditForm
                        fields={[TripEditFormEnum.Name]}
                        tripName={tripName}
                        onClickEdit={this.onEditTripName}
                        onCancel={this.closeEditNameModal} />
                </Modal>
            </View>
        );
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    var tripId = ownProps.tripId;
    var trip = _.find(storeState.trips, (item) => item.tripId == tripId);

    return {
        tripId: trip.tripId,
        tripName: trip.name,
        tripFromDate: trip.fromDate,
        tripToDate: trip.toDate
    };
};

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
    return {
        fetchLocations: (tripId) => dispatch(fetchTripLocations(tripId)),
        removeLocation: (tripId, locationId) => dispatch(removeLocation(tripId, locationId)),
        updateTripDateRange: (tripId, fromDate, toDate) => dispatch(updateTripDateRange(tripId, fromDate, toDate)),
        updateTripName: (tripId, tripName) => dispatch(updateTripName(tripId, tripName)),               
        updateLocations: (tripId, locations) => dispatch(updateLocations(tripId, locations))        
    };
};

const TripDetails = connect(
    mapStateToProps,
    mapDispatchToProps
)(TripDetailsComponent);

export default TripDetails;

