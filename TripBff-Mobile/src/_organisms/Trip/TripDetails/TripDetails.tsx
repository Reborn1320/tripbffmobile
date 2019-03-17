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
import { TripDateRangeForm } from "./TripDateRangeForm";
import { Moment } from "moment";
import { StoreData } from "../../../store/Interfaces";

interface IMapDispatchToProps {
    updateTripDateRange: (tripId: string, fromDate: Moment, toDate: Moment) => Promise<StoreData.TripVM>;
    removeLocation: (tripId: string, locationId: string) => Promise<void>
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
}

export interface DayVM {
    idx: number
    locations: LocationVM[]
}

export interface LocationVM {
    id: string
    address: string
    images: Array<ImageVM>
}

export interface ImageVM {
    url: string
    highlight: boolean
}

export class TripDetails extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            modalVisible: false,
            isConfirmationModalVisible: false,
            isEditDateRangeModalVisible: false,
        }
    }

    _renderItem = (itemInfo) => {
        const day: DayVM = itemInfo.item;
        return (

            <DayItem
                locations={day.locations} dayIdx={day.idx}
                toLocationDetailHandler={(locationId) => {
                    this.props.navigation.navigate("LocationDetail", { tripId: this.props.tripId, locationId })
                }}
                removeLocationHandler={(locationId) => this.removeLocation(locationId)}
            />
        )
    };

    removeLocation(locationId) {
        console.log("removeLocation")
        this.setState({
            isConfirmationModalVisible: true,
            focusingLocationId: locationId,
        })
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
            })
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
        })
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        const { isConfirmationModalVisible, isEditDateRangeModalVisible } = this.state;
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
                    <TripDateRangeForm fromDate={fromDate} toDate={toDate} onClickEdit={this.onEdit}
                    onCancel={this.closeEditDateRangeModal} />
                </Modal>
            </View>
        );
    }
}

