import React, { Component } from "react";
import { Container, Header, Content, Button, Text, View } from 'native-base';
import { Alert } from "react-native";
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import { tripApi } from "../../_services/apis";
import { PropsBase } from "../../_shared/LayoutContainer";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import * as RNa from "react-navigation";
import TripDetails from "../../../_organisms/Trip/TripDetails/TripDetails";
import TripDetailsModal from "../../../_organisms/Trip/TripDetails/TripDetailsModal"
import moment  from "moment";

export interface IMapDispatchToProps {
    addInfographicId: (tripId: string, infographicId: string) => void
    updateLocationFeeling?: (tripId: string, dateIdx: number, locationId: string, feeling: StoreData.FeelingVM) => Promise<void>
    updateLocationActivity: (tripId: string, dateIdx: number, locationId: string, activity: StoreData.ActivityVM) => Promise<void>
    removeLocation: (tripId: string, dateIdx: number, locationId: string) => Promise<void>
    addLocation: (tripId: string, dateIdx: number, location: StoreData.LocationVM) => Promise<void>;
    updateTripDateRange: (tripId: string, fromDate: moment.Moment, toDate: moment.Moment) => Promise<StoreData.TripVM>;
    updateTripName: (tripId: string, tripName: string) => Promise<StoreData.TripVM>;   
}

export interface Props extends IMapDispatchToProps, PropsBase {
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

export class TripDetailScreen extends Component<Props, State> {
    constructor(props: Props) {
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

    _cancelExportInfographic = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.TripsList);
    }

    _exportInfographic = () => {
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

    _confirmExportInfographic = ()  => {
        Alert.alert(
            'Confirm',
            'Export infographic ?',
            [
                { text: 'Cancel', onPress: this._cancelExportInfographic, style: 'cancel' },
                { text: 'OK', onPress: this._exportInfographic },
            ],
            { cancelable: false }
        )
    }

    _openRemoveLocationModal = (dateIdx, locationId) => {
        this.setState({
            isConfirmationModalVisible: true,
            dateIdx: dateIdx,
            focusingLocationId: locationId
        });
    }

    _removeLocationConfirmed = (dateIdx, locationId) => {
        this.props.removeLocation(this.props.tripId, dateIdx, locationId).then(() => {
            this.setState({
                isConfirmationModalVisible: false,
                dateIdx: null,
                focusingLocationId: null
            });
        });
    }

    _cancelModal = () => {
        this.setState({
            isConfirmationModalVisible: false,
            dateIdx: null,
            focusingLocationId: null,
        });
    }

    _openUpdateFeelingModal = (dateIdx, locationId) => {
        this.setState({
            isAddFeelingModalVisible: true,
            dateIdx: dateIdx,
            focusingLocationId: locationId
        });
    }

    _updateFeelingConfirmed = (dateIdx, locationId, feeling) => {

        this.props.updateLocationFeeling(this.props.tripId, dateIdx, locationId, feeling).then(() => {
            this.setState({
                isAddFeelingModalVisible: false,
                dateIdx: null,
                focusingLocationId: null
            });
        });
    }

    _cancelUpdatefeelingModal = () => {
        this.setState({
            isAddFeelingModalVisible: false,
            dateIdx: null,
            focusingLocationId: null
        })
    }

    _openUpdateActivityModal = (dateIdx, locationId) => {
        this.setState({
            isAddActivityModalVisible: true,
            dateIdx: dateIdx,
            focusingLocationId: locationId
        });
    }

    _updateActivityConfirmed = (dateIdx, locationId, activity) => {
        this.props.updateLocationActivity(this.props.tripId, dateIdx, locationId, activity).then(() => {
            this.setState({
                isAddActivityModalVisible: false,
                dateIdx: null,
                focusingLocationId: null
            });
        });
    }

    _cancelUpdateActivityModal = () => {
        this.setState({
            isAddActivityModalVisible: false,
            dateIdx: null,
            focusingLocationId: null
        })
    }

    _openAddLocationModal = (dateIdx, date) => {
        this.setState({
            isAddLocationModalVisible: true,
            dateIdx: dateIdx,
            addLocationSelectedDate: date
        });
    }   

    _addLocationConfirmed = (dateIdx, location) => {
        this.props.addLocation(this.props.tripId, dateIdx, location).then(() => {
            this.setState({
                isAddLocationModalVisible: false,
                dateIdx: null,
                addLocationSelectedDate: null
            });  
        });
    }

    _cancelAddLocationModal = () => {
        this.setState({
            isAddLocationModalVisible: false,
            dateIdx: null,
            addLocationSelectedDate: null
        });
    }

    _openEditDateRangeModal = () => {
        this.setState({
            isUpdateDateRangeModalVisible: true
        });
    }

    _onUpdateDateRange = (fromDate: moment.Moment, toDate: moment.Moment) => {
        this.setState({
            isUpdateDateRangeModalVisible: false
        });

        this.props.updateTripDateRange(this.props.tripId, fromDate, toDate);            
    }

    _cancelUpdateDateRangeModal = () => {
        this.setState({ isUpdateDateRangeModalVisible: false });
    }

    _openUpdateNameModal = () => {
        this.setState({
            isUpdateNameModalVisible: true
        });
    }

    _onUpdateTripName = (tripName: string) => {
        this.setState({ isUpdateNameModalVisible: false });
        this.props.updateTripName(this.props.tripId, tripName);            
    }

    _cancelUpdateNameModal = () => {
        this.setState({ isUpdateNameModalVisible: false });
    }


    render() {
        const tripId = this.props.tripId;
        const navigation = this.props.navigation;

        return (
            <Container>
                <Header>
                    <View style={{ height: 100, flex: 1, paddingTop: 10 }}>
                        <Button
                            style={{ marginLeft: 'auto' }}
                            onPress={this._confirmExportInfographic}>
                            <Text style={{ paddingTop: 15 }}>Done</Text>
                        </Button>
                    </View>

                </Header>
                <Content>
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
                </Content>
            </Container>
        );
    }
}


