import React, { Component } from "react";
import { Container, Header, Content, Button, Text, View } from 'native-base';
import { Alert, BackHandler } from "react-native";
import _, { } from "lodash";
import { tripApi } from "../../_services/apis";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import * as RNa from "react-navigation";
import TripDetailScreenContent from "./TripDetailScreenContent";

export interface IMapDispatchToProps {
    addInfographicId: (tripId: string, infographicId: string) => void;
}

export interface Props {
    tripId: string,
    navigation: RNa.NavigationScreenProp<any, any>;
}

interface State {
}

export class TripDetailScreen extends Component<Props & IMapDispatchToProps, State> {

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    private _handleBackPress = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.Profile);
        return true;
    }

    private _cancelExportInfographic = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.Profile);
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

    private _confirmExportInfographic = ()  => {
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
                    <TripDetailScreenContent tripId={tripId} navigation={navigation} />
                </Content>
            </Container>
        );
    }
}