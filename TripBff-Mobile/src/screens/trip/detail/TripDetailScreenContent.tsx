
import React, { Component } from "react";
import { View } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import { tripApi } from "../../_services/apis";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import * as RNa from "react-navigation";
import TripDetails from "../../../_organisms/Trip/TripDetails/TripDetails";
import TripDetailsModal from "../../../_organisms/Trip/TripDetails/TripDetailsModal"
import moment  from "moment";
import { updateLocationFeeling, 
    updateLocationActivity, 
    removeLocation, 
    addLocation } from "../../../store/Trip/operations";
  import { updateTripDateRange, updateTripName } from "../../../store/Trip/operations";
import { connect } from "react-redux";
import { addInfographicId } from "../../../store/Trip/actions";

export interface IMapDispatchToProps {
    addInfographicId: (tripId: string, infographicId: string) => void
    updateLocationFeeling?: (tripId: string, dateIdx: number, locationId: string, feeling: StoreData.FeelingVM) => Promise<void>
    updateLocationActivity: (tripId: string, dateIdx: number, locationId: string, activity: StoreData.ActivityVM) => Promise<void>
    removeLocation: (tripId: string, dateIdx: number, locationId: string) => Promise<void>
    addLocation: (tripId: string, dateIdx: number, location: StoreData.LocationVM) => Promise<void>;
    updateTripDateRange: (tripId: string, fromDate: moment.Moment, toDate: moment.Moment) => Promise<StoreData.TripVM>;
    updateTripName: (tripId: string, tripName: string) => Promise<StoreData.TripVM>;   
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
    addLocationSelectedDate: moment.Moment,
    isUpdateDateRangeModalVisible: boolean,
    isUpdateNameModalVisible: boolean
}

class TripDetailScreenContentInternal extends Component<Props & IMapDispatchToProps, State> {
    constructor(props: Props & IMapDispatchToProps) {
        super(props)

        this.state = {
            dateIdx: null,
            focusingLocationId: "",
            isAddActivityModalVisible: false,
            isAddFeelingModalVisible: false,
            isConfirmationModalVisible: false,
            isAddLocationModalVisible: false,
            addLocationSelectedDate: null,
            isUpdateDateRangeModalVisible: false,
            isUpdateNameModalVisible: false
        }
    }

    private _cancelExportInfographic = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.TripsList);
    }

    private _exportInfographic = () => {
        // call api to request export infographic
        var tripId = this.props.tripId;
        
        tripApi
            .post('/trips/' + tripId + '/infographics')
            .then(res => {
                var infographicId = res.data;
                // store infogphicId into store
                this.props.addInfographicId(tripId, infographicId);
                console.log('infographic id: ' + infographicId);
                this.props.navigation.navigate(NavigationConstants.Screens.TripsInfographicPreivew, { tripId: tripId });
            })
            .catch(error => {
                console.log("error: " + JSON.stringify(error));
            });
    }

    private _openRemoveLocationModal = (dateIdx, locationId) => {
        this.setState({
            isConfirmationModalVisible: true,
            dateIdx: dateIdx,
            focusingLocationId: locationId
        });
    }

    private _removeLocationConfirmed = (dateIdx, locationId) => {
        this.props.removeLocation(this.props.tripId, dateIdx, locationId).then(() => {
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

        this.props.updateLocationFeeling(this.props.tripId, dateIdx, locationId, feeling).then(() => {
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
        this.props.updateLocationActivity(this.props.tripId, dateIdx, locationId, activity).then(() => {
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
        this.props.addLocation(this.props.tripId, dateIdx, location).then(() => {
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

    private _openEditDateRangeModal = () => {
        this.setState({
            isUpdateDateRangeModalVisible: true
        });
    }

    private _onUpdateDateRange = (fromDate: moment.Moment, toDate: moment.Moment) => {
        this.setState({
            isUpdateDateRangeModalVisible: false
        });

        this.props.updateTripDateRange(this.props.tripId, fromDate, toDate);            
    }

    private _cancelUpdateDateRangeModal = () => {
        this.setState({ isUpdateDateRangeModalVisible: false });
    }

    private _openUpdateNameModal = () => {
        this.setState({
            isUpdateNameModalVisible: true
        });
    }

    private _onUpdateTripName = (tripName: string) => {
        this.setState({ isUpdateNameModalVisible: false });
        this.props.updateTripName(this.props.tripId, tripName);            
    }

    private _cancelUpdateNameModal = () => {
        this.setState({ isUpdateNameModalVisible: false });
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
                    openAddLocationModalHandler={this._openAddLocationModal}
                    openEditDateRangeModalHandler={this._openEditDateRangeModal}
                    openEditTripNameModalHandler={this._openUpdateNameModal}/>

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
                    selectedDate={this.state.addLocationSelectedDate}

                    isUpdateDateRangeModalVisible={this.state.isUpdateDateRangeModalVisible}
                    updateTripDateRangeHandler={this._onUpdateDateRange}
                    cancelUpdateDateRangeModalHandler={this._cancelUpdateDateRangeModal}

                    isUpdateNameModalVisible={this.state.isUpdateNameModalVisible}
                    updateTripNameHandler={this._onUpdateTripName}
                    cancelUpdateNameModal={this._cancelUpdateNameModal}/>     
            </View>                                                       
        );
    }
}

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
    return {
      addInfographicId: (tripId, infographicId) => dispatch(addInfographicId(tripId, infographicId)),
      updateLocationFeeling: (tripId, dateIdx, locationId, feeling) => dispatch(updateLocationFeeling(tripId, dateIdx, locationId, feeling)),
      updateLocationActivity: (tripId, dateIdx, locationId, activity) => dispatch(updateLocationActivity(tripId, dateIdx, locationId, activity)),
      removeLocation: (tripId, dateIdx, locationId) => dispatch(removeLocation(tripId, dateIdx, locationId)),
      addLocation: (tripId, dateIdx, location) => dispatch(addLocation(tripId, dateIdx, location)),
      updateTripDateRange: (tripId, fromDate, toDate) => dispatch(updateTripDateRange(tripId, fromDate, toDate)),
      updateTripName: (tripId, tripName) => dispatch(updateTripName(tripId, tripName))
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
  
