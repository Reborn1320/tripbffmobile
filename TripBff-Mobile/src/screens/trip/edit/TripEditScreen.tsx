import React, { Component } from "react";
import { Container, Header, Content, View, Button, Text } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import { PropsBase } from "../../_shared/LayoutContainer";
import * as RNa from "react-navigation";
import { mixins } from "../../../_utils";
import TripDetailScreenContent from "../detail/TripDetailScreenContent";
import { Alert } from "react-native";
import { tripApi } from "../../_services/apis";
import { NavigationConstants } from "../../_shared/ScreenConstants";

interface IMapDispatchToProps {
     addInfographicId: (tripId: string, infographicId: string) => void
}

export interface Props extends IMapDispatchToProps, PropsBase {
    trip: StoreData.TripVM,
    navigation: RNa.NavigationScreenProp<any, any>;
}

interface State {
}

export class TripEditScreen extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
        }
    }

    private _cancelExportInfographic = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.Profile);
    }

    private _exportInfographic = () => {
        // call api to request export infographic
        var tripId = this.props.trip.tripId;
        
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
        const { trip, navigation } = this.props;
        return (
            <Container>
                <Header>
                    <View>
                        <Button
                            style={{ marginLeft: 'auto' }}
                            onPress={() => this._confirmExportInfographic()}>
                            <Text style={{ paddingTop: 15 }}>Done</Text>
                        </Button>
                    </View>

                </Header>
                <Content>
                    <TripDetailScreenContent tripId={trip.tripId} navigation={navigation} />
                </Content>
            </Container>
        );
    }
}

