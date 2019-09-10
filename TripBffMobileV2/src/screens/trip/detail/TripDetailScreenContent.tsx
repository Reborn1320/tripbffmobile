
import React, { Component } from "react";
import { View } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import * as RNa from "react-navigation";
import TripDetails from "../../../_organisms/Trip/TripDetails/TripDetails";
import TripDetailsModal from "../../../_organisms/Trip/TripDetails/TripDetailsModal"
import moment  from "moment";
import { updateLocationFeeling, 
    updateLocationActivity, 
    removeLocation, 
    addLocation } from "../../../store/Trip/operations";
import { connect } from "react-redux";
import { getCancelToken } from "../../../_function/commonFunc";

export interface IMapDispatchToProps {
    updateLocationFeeling?: (tripId: string, dateIdx: number, locationId: string, feeling: StoreData.FeelingVM, cancelToken: any) => Promise<void>
    updateLocationActivity: (tripId: string, dateIdx: number, locationId: string, activity: StoreData.ActivityVM, cancelToken: any) => Promise<void>
    removeLocation: (tripId: string, dateIdx: number, locationId: string, cancelToken: any) => Promise<void>
    addLocation: (tripId: string, dateIdx: number, location: StoreData.LocationVM, cancelToken: any) => Promise<void>;
}

export interface Props {
    tripId: string,
    navigation: RNa.NavigationScreenProp<any, any>;
}

interface State {
    dateIdx: number,
    focusingLocationId?: string,
    isAddFeelingModalVisible: boolean,
    isAddActivityModalVisible: boolean,
    isConfirmationModalVisible: boolean,
    isAddLocationModalVisible: boolean,
    addLocationSelectedDate: moment.Moment
}

class TripDetailScreenContentInternal extends Component<Props & IMapDispatchToProps, State> {

    _cancelRequest;
    _cancelToken;

    constructor(props: Props & IMapDispatchToProps) {
        super(props)

        this.state = {
            dateIdx: null,
            focusingLocationId: "",
            isAddActivityModalVisible: false,
            isAddFeelingModalVisible: false,
            isConfirmationModalVisible: false,
            isAddLocationModalVisible: false,
            addLocationSelectedDate: null
        }
    }    

    componentDidMount() {
        let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
        this._cancelToken = cancelToken;
        this._cancelRequest = cancelRequest;
    }

    componentWillUnmount() {
        this._cancelRequest('Operation canceled by the user.');
    }

    private _openRemoveLocationModal = (dateIdx, locationId) => {
        this.setState({
            isConfirmationModalVisible: true,
            dateIdx: dateIdx,
            focusingLocationId: locationId
        });
    }

    private _removeLocationConfirmed = (dateIdx, locationId) => {
        this.props.removeLocation(this.props.tripId, dateIdx, locationId, this._cancelToken).then(() => {
            this.setState({
                isConfirmationModalVisible: false,
                dateIdx: null,
                focusingLocationId: null
            });
        });
    }

    private _cancelModal = () => {
        this.setState({
            isConfirmationModalVisible: false,
            dateIdx: null,
            focusingLocationId: null,
        });
    }

    private _openUpdateFeelingModal = (dateIdx, locationId) => {
        this.setState({
            isAddFeelingModalVisible: true,
            dateIdx: dateIdx,
            focusingLocationId: locationId
        });
    }

    private _updateFeelingConfirmed = (dateIdx, locationId, feeling) => {

        this.props.updateLocationFeeling(this.props.tripId, dateIdx, locationId, feeling, this._cancelToken).then(() => {
            this.setState({
                isAddFeelingModalVisible: false,
                dateIdx: null,
                focusingLocationId: null
            });
        });
    }

    private _cancelUpdatefeelingModal = () => {
        this.setState({
            isAddFeelingModalVisible: false,
            dateIdx: null,
            focusingLocationId: null
        })
    }

    private _openUpdateActivityModal = (dateIdx, locationId) => {
        this.setState({
            isAddActivityModalVisible: true,
            dateIdx: dateIdx,
            focusingLocationId: locationId
        });
    }

    private _updateActivityConfirmed = (dateIdx, locationId, activity) => {
        this.props.updateLocationActivity(this.props.tripId, dateIdx, locationId, activity, this._cancelToken).then(() => {
            this.setState({
                isAddActivityModalVisible: false,
                dateIdx: null,
                focusingLocationId: null
            });
        });
    }

    private _cancelUpdateActivityModal = () => {
        this.setState({
            isAddActivityModalVisible: false,
            dateIdx: null,
            focusingLocationId: null
        })
    }

    private _openAddLocationModal = (dateIdx, date) => {
        this.setState({
            isAddLocationModalVisible: true,
            dateIdx: dateIdx,
            addLocationSelectedDate: date
        });
    }   

    private _addLocationConfirmed = (dateIdx, location) => {
        this.props.addLocation(this.props.tripId, dateIdx, location, this._cancelToken).then(() => {
            this.setState({
                isAddLocationModalVisible: false,
                dateIdx: null,
                addLocationSelectedDate: null
            });  
        });
    }

    private _cancelAddLocationModal = () => {
        this.setState({
            isAddLocationModalVisible: false,
            dateIdx: null,
            addLocationSelectedDate: null
        });
    }

    render() {
        const tripId = this.props.tripId;
        const navigation = this.props.navigation;

        return (
            <View>
                <TripDetails tripId={tripId}
                    navigation={navigation}
                    openUpdateFeelingModalHandler={this._openUpdateFeelingModal}
                    openUpdateActivityModalHandler={this._openUpdateActivityModal} 
                    openRemoveLocationModalHandler={this._openRemoveLocationModal}
                    openAddLocationModalHandler={this._openAddLocationModal}/>

                <TripDetailsModal                            
                    tripId={tripId}
                    dateIdx={this.state.dateIdx}
                    locationId={this.state.focusingLocationId}

                    isAddFeelingModalVisible={this.state.isAddFeelingModalVisible}
                    confirmUpdateLocationFeelingHandler={this._updateFeelingConfirmed}
                    cancelUpdateLocationFeelingHandler={this._cancelUpdatefeelingModal}

                    isAddActivityModalVisible={this.state.isAddActivityModalVisible}
                    updateActivityConfirmedHandler={this._updateActivityConfirmed}
                    cancelUpdateActivityModalHandler={this._cancelUpdateActivityModal}

                    isConfirmationModalVisible={this.state.isConfirmationModalVisible}
                    removeLocationConfirmedHandler={this._removeLocationConfirmed}
                    cancelRemoveLocationModalHandler={this._cancelModal}

                    isAddLocationModalVisible={this.state.isAddLocationModalVisible}     
                    addLocationConfirmedHandler={this._addLocationConfirmed}
                    cancelAddLocationModalHandler={this._cancelAddLocationModal}                   
                    selectedDate={this.state.addLocationSelectedDate}/>     
            </View>                                                       
        );
    }
}

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
    return {
      updateLocationFeeling: (tripId, dateIdx, locationId, feeling, cancelToken) => dispatch(updateLocationFeeling(tripId, dateIdx, locationId, feeling, cancelToken)),
      updateLocationActivity: (tripId, dateIdx, locationId, activity, cancelToken) => dispatch(updateLocationActivity(tripId, dateIdx, locationId, activity, cancelToken)),
      removeLocation: (tripId, dateIdx, locationId, cancelToken) => dispatch(removeLocation(tripId, dateIdx, locationId, cancelToken)),
      addLocation: (tripId, dateIdx, location, cancelToken) => dispatch(addLocation(tripId, dateIdx, location, cancelToken)),
    };
  };
  
  const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    var { tripId } = ownProps.navigation.state.params;
  
    return {
        tripId: tripId
    };
  };
  
  const TripDetailScreenContent = connect(
    mapStateToProps,
    mapDispatchToProps
  )(TripDetailScreenContentInternal);
  
  export default TripDetailScreenContent;
  
