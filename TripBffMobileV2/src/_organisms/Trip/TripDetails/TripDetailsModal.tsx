import React, { Component, PureComponent } from "react";
import { View } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import AddFeelingModal from "../../../_organisms/Trip/TripDetails/AddFeelingModal";
import AddActivityModal from "../../../_organisms/Trip/TripDetails/AddActivityModal";
import ConfirmationModal from "../../../_molecules/ConfirmationModal";
import AddLocationModal from "../../../_organisms/Trip/TripDetails/AddLocationModal"
import moment, { Moment } from 'moment';
import { Modal } from "../../../_atoms";
import TripEditForm, { TripEditFormEnum } from "../../TripEditForm/TripEditForm";
import DateRangePicker from "../../../_atoms/DatePicker/DateRangePicker";
import { connect } from "react-redux";

interface IMapDispatchToProps {
    confirmUpdateLocationFeelingHandler: (dateIdx: number, locationId: string, feeling: StoreData.FeelingVM) => void
    cancelUpdateLocationFeelingHandler: () => void
    removeLocationConfirmedHandler: (dateIdx: number, locationId: string) => void
    cancelRemoveLocationModalHandler: () => void
    updateActivityConfirmedHandler: (dateIdx: number, locationId: string, activity: StoreData.ActivityVM) => void
    cancelUpdateActivityModalHandler: () => void
    addLocationConfirmedHandler: (dateIdx: number, location: StoreData.LocationVM) => void
    cancelAddLocationModalHandler: () => void
    updateTripDateRangeHandler: (fromDate: moment.Moment, toDate: moment.Moment) => void
    cancelUpdateDateRangeModalHandler: () => void
    updateTripNameHandler: (nane: string) => void
    cancelUpdateNameModal: () => void
}

export interface Props extends IMapDispatchToProps {
    tripId: string,
    tripName?: string,
    fromDate?: Moment,
    toDate?: Moment,
    dateIdx: number,
    locationId: string,
    isAddFeelingModalVisible: boolean,
    isAddActivityModalVisible: boolean,
    isConfirmationModalVisible: boolean,
    isAddLocationModalVisible: boolean,
    selectedDate: moment.Moment,
    isUpdateDateRangeModalVisible: boolean,
    isUpdateNameModalVisible: boolean
}

interface State {
}

class TripDetailsModalComponent extends PureComponent<Props, State> { 

    _removeLocationConfirmed = () => {
        this.props.removeLocationConfirmedHandler(this.props.dateIdx, this.props.locationId);
    }

    _cancelModal = () => {
        this.props.cancelRemoveLocationModalHandler();
    }

    _updateFeelingConfirmed = (locationId, feeling) => {
        this.props.confirmUpdateLocationFeelingHandler(this.props.dateIdx, locationId, feeling);
    }

    _cancelUpdatefeelingModal = () => {
        this.props.cancelUpdateLocationFeelingHandler();
    }

    _updateActivityConfirmed = (locationId, activity) => {
        this.props.updateActivityConfirmedHandler(this.props.dateIdx, locationId, activity);
    }

    _cancelUpdateActivityModal = () => {
        this.props.cancelUpdateActivityModalHandler();
    }

    _addLocationConfirmed = (name, address, long, lat, fromTime) => {
        this.setState({
            isAddLocationModalVisible: false
        });

        var location: StoreData.LocationVM = {
            locationId: "",
            name: name,
            location: {
                address: address,
                long: long,
                lat: lat
            },
            images: [],
            fromTime: fromTime,
            toTime: fromTime
        };

        this.props.addLocationConfirmedHandler(this.props.dateIdx, location);
    }

    _cancelAddLocationModal = () => {
        this.props.cancelAddLocationModalHandler();
    }

    _onUpdateDateRange = (fromDate: moment.Moment, toDate: moment.Moment) => {
        this.props.updateTripDateRangeHandler(fromDate, toDate);            
    }

    _cancelUpdateDateRangeModal = () => {
        this.props.cancelUpdateDateRangeModalHandler();
    }

    _onUpdateTripName = (tripName: string) => {
        this.props.updateTripNameHandler(tripName);         
    }

    _cancelUpdateNameModal = () => {
        this.props.cancelUpdateNameModal();
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
                <DateRangePicker 
                    isVisible={this.props.isUpdateDateRangeModalVisible}
                    fromDate={this.props.fromDate}
                    toDate={this.props.toDate}
                    cancelHandler={this._cancelUpdateDateRangeModal}
                    confirmHandler={this._onUpdateDateRange}>            
                </DateRangePicker> 
                <Modal isVisible={this.props.isUpdateNameModalVisible}
                    title="Edit trip name"
                >
                    <TripEditForm
                        fields={[TripEditFormEnum.Name]}
                        tripName={this.props.tripName}
                        onClickEdit={this._onUpdateTripName}
                        onCancel={this._cancelUpdateNameModal} />
                </Modal>
            </View>
        );
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    var tripId  = ownProps.tripId;
    var trip = storeState.currentTrip;
  
    return {
        tripName: trip.name,
        fromDate: trip.fromDate,
        toDate: trip.toDate
    };
  };
  
  const TripDetailsModal = connect(
    mapStateToProps,
    null
  )(TripDetailsModalComponent);

export default TripDetailsModal;


