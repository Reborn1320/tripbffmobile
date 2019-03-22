import React, { Component } from "react";
import { Container, Header, Content, Button, Text, View } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import { connect } from "react-redux";
import AddFeelingModal from "../../../_organisms/Trip/TripDetails/AddFeelingModal";
import AddActivityModal from "../../../_organisms/Trip/TripDetails/AddActivityModal";
import { updateLocationFeeling, updateLocationActivity } from "../../../store/Trip/operations";

interface IMapDispatchToProps {
    updateLocationFeeling?: (tripId: string, locationId: string, feeling: StoreData.FeelingVM) => Promise<void>
    updateLocationActivity?: (tripId: string, locationId: string, activity: StoreData.ActivityVM) => Promise<void>
}

export interface Props extends IMapDispatchToProps {
    tripId: string,
    locationId: string,
    isAddFeelingModalVisible: boolean,
    isAddActivityModalVisible: boolean
}

interface State {
}

export class TripDetailsModalComponent extends Component<Props, State> { 

    _updateFeelingConfirmed = (locationId, feeling) => {
        this.setState({
            isAddFeelingModalVisible: false
        });
        this.props.updateLocationFeeling(this.props.tripId, locationId, feeling);
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
        this.props.updateLocationActivity(this.props.tripId, locationId, activity);
    }

    _cancelUpdateActivityModal = () => {
        this.setState({
            isAddActivityModalVisible: false
        })
    }

    render() {
        return (
            <View>
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
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
    return {
        updateLocationFeeling: (tripId, locationId, feeling) => dispatch(updateLocationFeeling(tripId, locationId, feeling)),
        updateLocationActivity: (tripId, locationId, activity) => dispatch(updateLocationActivity(tripId, locationId, activity))
    };
};

const TripDetailsModal = connect(
    null,
    mapDispatchToProps
)(TripDetailsModalComponent);

export default TripDetailsModal;


