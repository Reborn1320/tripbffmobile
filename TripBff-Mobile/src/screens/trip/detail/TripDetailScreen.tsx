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

interface IMapDispatchToProps {
    addInfographicId: (tripId: string, infographicId: string) => void
}

export interface Props extends IMapDispatchToProps, PropsBase {
    trip: StoreData.TripVM,
    navigation: RNa.NavigationScreenProp<any, any>;
}

interface State {
    focusingLocationId?: string,
    isAddFeelingModalVisible: boolean,
    isAddActivityModalVisible: boolean
}

export class TripDetailScreen extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            focusingLocationId: "",
            isAddActivityModalVisible: false,
            isAddFeelingModalVisible: false
        }
    }

    getTripId = () => {
        return this.props.trip.tripId;
    }

    exportInfographic() {
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

    confirmExportInfographic() {
        Alert.alert(
            'Confirm',
            'Export infographic ?',
            [
                { text: 'Cancel', onPress: () => this.props.navigation.navigate(NavigationConstants.Screens.TripsList), style: 'cancel' },
                { text: 'OK', onPress: () => this.exportInfographic() },
            ],
            { cancelable: false }
        )
    }

    _openUpdateFeelingModal = (locationId) => {
        this.setState({
            isAddFeelingModalVisible: true,
            focusingLocationId: locationId
        });
    }

    _openUpdateActivityModal = (locationId) => {
        this.setState({
            isAddActivityModalVisible: true,
            focusingLocationId: locationId
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
                            onPress={() => this.confirmExportInfographic()}>
                            <Text style={{ paddingTop: 15 }}>Done</Text>
                        </Button>
                    </View>

                </Header>
                <Content>
                    <TripDetails tripId={tripId}
                        openUpdateFeelingModalHandler={this._openUpdateFeelingModal}
                        openUpdateActivityModalHandler={this._openUpdateActivityModal} />

                    <TripDetailsModal 
                        tripId={tripId}
                        locationId={this.state.focusingLocationId}
                        isAddFeelingModalVisible={this.state.isAddFeelingModalVisible}
                        isAddActivityModalVisible={this.state.isAddActivityModalVisible}/>                    
                </Content>
            </Container>
        );
    }
}


