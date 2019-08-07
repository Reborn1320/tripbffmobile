import React, { Component, PureComponent } from "react";
import { View } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import AddFeelingModal from "../../../_organisms/Trip/TripDetails/AddFeelingModal";
import AddActivityModal from "../../../_organisms/Trip/TripDetails/AddActivityModal";
import ConfirmationModal from "../../../_molecules/ConfirmationModal";
import AddLocationModal from "../../../_organisms/Trip/TripDetails/AddLocationModal"
import moment, { Moment } from 'moment';
import { connect } from "react-redux";
import { getLabel } from "../../../../i18n";

interface IMapDispatchToProps {
    confirmUpdateLocationFeelingHandler: (dateIdx: number, locationId: string, feeling: StoreData.FeelingVM) => void
    cancelUpdateLocationFeelingHandler: () => void
    removeLocationConfirmedHandler: (dateIdx: number, locationId: string) => void
    cancelRemoveLocationModalHandler: () => void
    updateActivityConfirmedHandler: (dateIdx: number, locationId: string, activity: StoreData.ActivityVM) => void
    cancelUpdateActivityModalHandler: () => void
    addLocationConfirmedHandler: (dateIdx: number, location: StoreData.LocationVM) => void
    cancelAddLocationModalHandler: () => void
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
    selectedDate: moment.Moment
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

    render() {
        return (
            <View>
                <ConfirmationModal title={getLabel("trip_detail.delete_location_modal_header")} 
                    content={getLabel("trip_detail.delete_location_modal_content")}
                    confirmHandler={this._removeLocationConfirmed}
                    cancelHandler={this._cancelModal}
                    isVisible={this.props.isConfirmationModalVisible} />
                <AddFeelingModal
                    isVisible={this.props.isAddFeelingModalVisible}
                    locationId={this.props.locationId}
                    dateIdx={this.props.dateIdx}
                    confirmHandler={this._updateFeelingConfirmed}
                    cancelHandler={this._cancelUpdatefeelingModal} />
                 <AddActivityModal
                    isVisible={this.props.isAddActivityModalVisible}
                    locationId={this.props.locationId}
                    dateIdx={this.props.dateIdx}
                    confirmHandler={this._updateActivityConfirmed}
                    cancelHandler={this._cancelUpdateActivityModal} />
                <AddLocationModal
                    isVisible={this.props.isAddLocationModalVisible}
                    date={this.props.selectedDate}
                    confirmHandler={this._addLocationConfirmed}
                    cancelHandler={this._cancelAddLocationModal} />                
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


