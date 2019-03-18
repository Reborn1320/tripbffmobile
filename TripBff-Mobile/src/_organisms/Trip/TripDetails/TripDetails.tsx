import React, { Component } from "react";
import { Spinner, View, H1, Icon } from 'native-base';
import { FlatList } from "react-native";
import _, { } from "lodash";
import DayItem from "../../../_molecules/Trip/DayItem/DayItem";
import * as RNa from "react-navigation";
import ConfirmationModal from "../../../_molecules/ConfirmationModal";
import { mixins } from "../../../_utils";
import EditPopupMenu from "../../../_molecules/Trip/EditPopupMenu/EditPopupMenu";
import { Modal } from "../../../_atoms";
import { TripDateRangeForm, TripDateRangeFormEnum } from "../../TripDateRangeForm/TripDateRangeForm";
import moment, { Moment } from "moment";
import { StoreData } from "../../../store/Interfaces";
import AddLocationModal from "./AddLocationModal";
import AddFeelingModal from "./AddFeelingModal";
import AddActivityModal from "./AddActivityModal";

interface IMapDispatchToProps {
    updateTripDateRange: (tripId: string, fromDate: Moment, toDate: Moment) => Promise<StoreData.TripVM>;
    removeLocation: (tripId: string, locationId: string) => Promise<void>
    addLocation: (address: string, fromTime: moment.Moment) => Promise<void>
    updateLocationFeeling: (locationId: string, feeling: StoreData.FeelingVM) => Promise<void>
    updateLocationActivity: (locationId: string, activity: StoreData.ActivityVM) => Promise<void>
}

export interface Props extends IMapDispatchToProps {
    navigation: RNa.NavigationScreenProp<any, any>;
    tripId: string,
    days: DayVM[],
    isLoaded: boolean,
    tripName: string,
    fromDate: Moment,
    toDate: Moment,
    onRefresh: () => void;
}

interface State {
    modalVisible: boolean,
    isConfirmationModalVisible: boolean,
    focusingLocationId?: string,
    isEditDateRangeModalVisible: boolean,
    isAddLocationModalVisible: boolean,
    selectedDate: moment.Moment
    isAddFeelingModalVisible: boolean,
    isAddActivityModalVisible: boolean
}

export interface DayVM {
    idx: number,
    date?: moment.Moment,
    locations: LocationVM[]
}

export interface LocationVM {
    id: string
    address: string
    images: Array<ImageVM>,
    feeling?: FeelingVM,
    activity?: ActivityVM
}

export interface ImageVM {
    url: string
    highlight: boolean
}

export interface FeelingVM {
    feelingId: number,
    label: string,
    icon: string
}

export interface ActivityVM {
    activityId: number,
    label: string,
    icon: string
}

export class TripDetails extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            modalVisible: false,
            isConfirmationModalVisible: false,
            isEditDateRangeModalVisible: false,
            isAddLocationModalVisible: false,
            selectedDate: null,
            isAddFeelingModalVisible: false,
            isAddActivityModalVisible: false
        }
    }

    _renderItem = (itemInfo) => {
        const day: DayVM = itemInfo.item;
        return (

            <DayItem
                locations={day.locations} dayIdx={day.idx} date={day.date}
                toLocationDetailHandler={(locationId) => {
                    this.props.navigation.navigate("LocationDetail", { tripId: this.props.tripId, locationId })
                }}
                removeLocationHandler={(locationId) => this.removeLocation(locationId)}
                addLocationHandler={(dayIdx, date) => this.addLocationModal(dayIdx, date)}
                addFeelingModalHandler={(locationId) => this.openAddFeelingModal(locationId)}
                addActivityModalHandler={(locationId) => this.openAddActivityModal(locationId)}
            />
        )
    };

    removeLocation(locationId) {
        console.log("removeLocation")
        this.setState({
            isConfirmationModalVisible: true,
            focusingLocationId: locationId,
        });
    }

    onPopupMenuSelect = (value) => {
        console.log(`Selected number: ${value}`);
        if (value == 1) {
            this.setState({
                isEditDateRangeModalVisible: true
            });
        }
    }

    onEdit = (fromDate: Moment, toDate: Moment) => {
        this.props.updateTripDateRange(this.props.tripId, fromDate, toDate)
            .then(newTrip => {
                this.setState({
                    isEditDateRangeModalVisible: false
                });
                this.props.onRefresh();
            });
    }

    private closeEditDateRangeModal = () => {
        this.setState({ isEditDateRangeModalVisible: false });
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

    addLocationModal(dayIdx, date) {
        this.setState({
            isAddLocationModalVisible: true,
            selectedDate: date
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

    openAddFeelingModal(locationId) {
        this.setState({
            isAddFeelingModalVisible: true,
            focusingLocationId: locationId
        });
    }

    _updateFeelingConfirmed = (locationId, feeling) => {
        this.setState({
            isAddFeelingModalVisible: false
        });
        this.props.updateLocationFeeling(locationId, feeling);
    }

    _cancelAddfeelingModal = () => {
        this.setState({
            isAddFeelingModalVisible: false
        })
    }

    openAddActivityModal(locationId) {
        this.setState({
            isAddActivityModalVisible: true,
            focusingLocationId: locationId
        });
    }

    _updateActivityConfirmed = (locationId, activity) => {
        this.setState({
            isAddActivityModalVisible: false
        });
        this.props.updateLocationActivity(locationId, activity);
    }

    _cancelAddActivityModal = () => {
        this.setState({
            isAddActivityModalVisible: false
        })
    }

    render() {
        const {
            isConfirmationModalVisible,
            isEditDateRangeModalVisible,
            isAddLocationModalVisible,
            selectedDate,
            isAddFeelingModalVisible,
            focusingLocationId,
            isAddActivityModalVisible } = this.state;
        const { tripName, days, isLoaded, fromDate, toDate } = this.props;
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
                        data={days}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => String(index)}
                    />}
                <ConfirmationModal title="DELETE LOCATION" content="Do you want to delete this location ?"
                    confirmHandler={this._removeLocationConfirmed}
                    cancelHandler={this._cancelModal}
                    isVisible={isConfirmationModalVisible} />
                <Modal isVisible={isEditDateRangeModalVisible}
                    title="Edit date range"
                    height={250}
                >
                    <TripDateRangeForm
                        fields={[TripDateRangeFormEnum.Name, TripDateRangeFormEnum.DateRange]}
                        fromDate={fromDate} toDate={toDate}
                        onClickEdit={this.onEdit}
                        onCancel={this.closeEditDateRangeModal} />
                </Modal>
                <AddLocationModal
                    isVisible={isAddLocationModalVisible}
                    date={selectedDate}
                    confirmHandler={this._addLocationConfirmed}
                    cancelHandler={this._cancelAddLocationModal} />
                <AddFeelingModal
                    isVisible={isAddFeelingModalVisible}
                    locationId={focusingLocationId}
                    confirmHandler={this._updateFeelingConfirmed}
                    cancelHandler={this._cancelAddfeelingModal} />
                <AddActivityModal
                    isVisible={isAddActivityModalVisible}
                    locationId={focusingLocationId}
                    confirmHandler={this._updateActivityConfirmed}
                    cancelHandler={this._cancelAddActivityModal} />
            </View>
        );
    }
}

