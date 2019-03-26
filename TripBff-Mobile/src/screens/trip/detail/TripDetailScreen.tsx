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

interface IMapDispatchToProps {
    addInfographicId: (tripId: string, infographicId: string) => void
}

export interface Props extends IMapDispatchToProps, PropsBase {
    trip: StoreData.TripVM,
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
    isEditDateRangeModalVisible: boolean,
    isEditNameModalVisible: boolean
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
            isEditDateRangeModalVisible: false,
            isEditNameModalVisible: false
        }
    }

    getTripId = () => {
        return this.props.trip.tripId;
    }

    _cancelExportInfographic = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.TripsList);
    }

    _exportInfographic = () => {
        // call api to request export infographic
        var tripId = this.getTripId();
        
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

    _openUpdateFeelingModal = (dateIdx, locationId) => {
        this.setState({
            isAddFeelingModalVisible: true,
            dateIdx: dateIdx,
            focusingLocationId: locationId
        });
    }

    _openUpdateActivityModal = (dateIdx, locationId) => {
        this.setState({
            isAddActivityModalVisible: true,
            dateIdx: dateIdx,
            focusingLocationId: locationId
        });
    }

    _openAddLocationModal(dateIdx, date) {
        this.setState({
            isAddLocationModalVisible: true,
            dateIdx: dateIdx,
            addLocationSelectedDate: date
        });
    }   

    _openEditDateRangeModal() {
        this.setState({
            isEditDateRangeModalVisible: true
        });
    }

    _openEditNameModal() {
        this.setState({
            isEditNameModalVisible: true
        });
    }

    render() {
        const tripId = this.getTripId();

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
                    <TripDetails tripId={tripId}
                        openUpdateFeelingModalHandler={this._openUpdateFeelingModal}
                        openUpdateActivityModalHandler={this._openUpdateActivityModal} 
                        openRemoveLocationModalHandler={this._openRemoveLocationModal}
                        openAddLocationModalHandler={this._openAddLocationModal}
                        openEditDateRangeModalHandler={this._openEditDateRangeModal}
                        openEditTripNameModalHandler={this._openEditNameModal}/>

                    <TripDetailsModal 
                        tripId={tripId}
                        dateIdx={this.state.dateIdx}
                        locationId={this.state.focusingLocationId}
                        isAddFeelingModalVisible={this.state.isAddFeelingModalVisible}
                        isAddActivityModalVisible={this.state.isAddActivityModalVisible}
                        isConfirmationModalVisible={this.state.isConfirmationModalVisible}
                        isAddLocationModalVisible={this.state.isAddLocationModalVisible}
                        selectedDate={this.state.addLocationSelectedDate}
                        isEditDateRangeModalVisible={this.state.isEditDateRangeModalVisible}
                        tripFromDate={this.props.trip.fromDate}
                        tripToDate={this.props.trip.toDate}
                        isEditNameModalVisible={this.state.isEditNameModalVisible}
                        tripName={this.props.trip.name}/>                    
                </Content>
            </Container>
        );
    }
}


