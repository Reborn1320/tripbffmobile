import React, { Component } from "react";
import { Container, Header, Content, Button, Text, View } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import { connect } from "react-redux";
import AddFeelingModal from "../../../_organisms/Trip/TripDetails/AddFeelingModal";
import AddActivityModal from "../../../_organisms/Trip/TripDetails/AddActivityModal";
import { updateLocationFeeling, 
         updateLocationActivity, 
         removeLocation, 
         addLocation } from "../../../store/Trip/operations";
import ConfirmationModal from "../../../_molecules/ConfirmationModal";
import AddLocationModal from "../../../_organisms/Trip/TripDetails/AddLocationModal"
import moment from 'moment';
import { Modal } from "../../../_atoms";
import { TripEditForm, TripEditFormEnum } from "../../TripEditForm/TripEditForm";
import { updateTripDateRange, updateTripName } from "../../../store/Trip/operations";

interface IMapDispatchToProps {
    updateLocationFeeling?: (tripId: string, dateIdx: number, locationId: string, feeling: StoreData.FeelingVM) => Promise<void>
    updateLocationActivity?: (tripId: string, dateIdx: number, locationId: string, activity: StoreData.ActivityVM) => Promise<void>
    removeLocation?: (tripId: string, dateIdx: number, locationId: string) => Promise<void>
    addLocation?: (tripId: string, dateIdx: number, location: StoreData.LocationVM) => Promise<void>;
    updateTripDateRange?: (tripId: string, fromDate: moment.Moment, toDate: moment.Moment) => Promise<StoreData.TripVM>;
    updateTripName?: (tripId: string, tripName: string) => Promise<StoreData.TripVM>;   
}

export interface Props extends IMapDispatchToProps {
    tripId: string,
    dateIdx: number,
    locationId: string,
    isAddFeelingModalVisible: boolean,
    isAddActivityModalVisible: boolean,
    isConfirmationModalVisible: boolean,
    isAddLocationModalVisible: boolean,
    selectedDate: moment.Moment,
    isEditDateRangeModalVisible: boolean,
    tripFromDate: moment.Moment,
    tripToDate: moment.Moment,
    isEditNameModalVisible: boolean,
    tripName: string
}

interface State {
}

export class TripDetailsModalComponent extends Component<Props, State> { 

    _removeLocationConfirmed = () => {
        this.setState({
            isConfirmationModalVisible: false
        });

        this.props.removeLocation(this.props.tripId, this.props.dateIdx, this.props.locationId);
    }

    _cancelModal = () => {
        this.setState({
            isConfirmationModalVisible: false,
            focusingLocationId: null,
        });
    }

    _updateFeelingConfirmed = (locationId, feeling) => {
        this.setState({
            isAddFeelingModalVisible: false
        });
        this.props.updateLocationFeeling(this.props.tripId, this.props.dateIdx, locationId, feeling);
    }

    _cancelUpdatefeelingModal = () => {
        this.setState({
            isAddFeelingModalVisible: false
        })
    }

    _updateActivityConfirmed = (locationId, activity) => {
        this.setState({
            isAddActivityModalVisible: false
        });
        this.props.updateLocationActivity(this.props.tripId, this.props.dateIdx, locationId, activity);
    }

    _cancelUpdateActivityModal = () => {
        this.setState({
            isAddActivityModalVisible: false
        })
    }

    _addLocationConfirmed = (address, fromTime) => {
        this.setState({
            isAddLocationModalVisible: false
        });

        var location: StoreData.LocationVM = {
            locationId: "",
            location: {
                address: address,
                long: null,
                lat: null
            },
            images: null,
            fromTime: fromTime,
            toTime: fromTime
        };

        this.props.addLocation(this.props.tripId, this.props.dateIdx, location);
    }

    _cancelAddLocationModal = () => {
        this.setState({
            isAddLocationModalVisible: false
        });
    }

    _onEditDateRange = (tripName: string, fromDate: moment.Moment, toDate: moment.Moment) => {
        this.setState({
            isEditDateRangeModalVisible: false
        });

        this.props.updateTripDateRange(this.props.tripId, fromDate, toDate);            
    }

    _closeEditDateRangeModal = () => {
        this.setState({ isEditDateRangeModalVisible: false });
    }

    _onEditTripName = (tripName: string) => {
        this.setState({ isEditNameModalVisible: false });
        this.props.updateTripName(this.props.tripId, tripName);            
    }

    _closeEditNameModal = () => {
        this.setState({ isEditNameModalVisible: false });
    }

    render() {
        return (
            <View>
                <ConfirmationModal title="DELETE LOCATION" content="Do you want to delete this location ?"
                    confirmHandler={this._removeLocationConfirmed}
                    cancelHandler={this._cancelModal}
                    isVisible={this.props.isConfirmationModalVisible} />
                <AddFeelingModal
                    isVisible={this.props.isAddFeelingModalVisible}
                    locationId={this.props.locationId}
                    confirmHandler={this._updateFeelingConfirmed}
                    cancelHandler={this._cancelUpdatefeelingModal} />
                 <AddActivityModal
                    isVisible={this.props.isAddActivityModalVisible}
                    locationId={this.props.locationId}
                    confirmHandler={this._updateActivityConfirmed}
                    cancelHandler={this._cancelUpdateActivityModal} />
                <AddLocationModal
                    isVisible={this.props.isAddLocationModalVisible}
                    date={this.props.selectedDate}
                    confirmHandler={this._addLocationConfirmed}
                    cancelHandler={this._cancelAddLocationModal} />
                <Modal isVisible={this.props.isEditDateRangeModalVisible}
                    title="Edit date range"
                >
                    <TripEditForm
                        fields={[TripEditFormEnum.DateRange]}
                        fromDate={this.props.tripFromDate} toDate={this.props.tripToDate}
                        onClickEdit={this._onEditDateRange}
                        onCancel={this._closeEditDateRangeModal} />
                </Modal>
                <Modal isVisible={this.props.isEditNameModalVisible}
                    title="Edit trip name"
                >
                    <TripEditForm
                        fields={[TripEditFormEnum.Name]}
                        tripName={this.props.tripName}
                        onClickEdit={this._onEditTripName}
                        onCancel={this._closeEditNameModal} />
                </Modal>
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
    return {
        updateLocationFeeling: (tripId, dateIdx, locationId, feeling) => dispatch(updateLocationFeeling(tripId, dateIdx, locationId, feeling)),
        updateLocationActivity: (tripId, dateIdx, locationId, activity) => dispatch(updateLocationActivity(tripId, dateIdx, locationId, activity)),
        removeLocation: (tripId, dateIdx, locationId) => dispatch(removeLocation(tripId, dateIdx, locationId)),
        addLocation: (tripId, dateIdx, location) => dispatch(addLocation(tripId, dateIdx, location)),
        updateTripDateRange: (tripId, fromDate, toDate) => dispatch(updateTripDateRange(tripId, fromDate, toDate)),
        updateTripName: (tripId, tripName) => dispatch(updateTripName(tripId, tripName))
    };
};

const TripDetailsModal = connect(
    null,
    mapDispatchToProps
)(TripDetailsModalComponent);

export default TripDetailsModal;


