import React, { Component } from "react";
import { Container, Header, Content, View, Button, Text } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import { PropsBase } from "../../_shared/LayoutContainer";
import * as RNa from "react-navigation";
import { mixins } from "../../../_utils";
import TripDetailScreenContent from "../detail/TripDetailScreenContent";
import { Alert, StyleSheet } from "react-native";
import { tripApi } from "../../_services/apis";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Loading from "../../../_atoms/Loading/Loading";

interface IMapDispatchToProps {
    addInfographicId: (tripId: string, infographicId: string) => void
    fetchTrip: (tripId: string) => Promise<void>
}

export interface Props extends IMapDispatchToProps, PropsBase {
    tripId: string,
    trip: StoreData.TripVM,
    navigation: RNa.NavigationScreenProp<any, any>;
}

interface State {
    isLoaded: boolean;
}

export class TripEditScreen extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            isLoaded: false,
        }
    }

    componentWillMount() {
        this.props.fetchTrip(this.props.tripId)
        .then(() => this.setState({
            isLoaded: true
        }));
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
        const { isLoaded } = this.state;
        return (
            <Container>
                <Content>
                    {!isLoaded && <Loading message="Loading trip" />}
                    {isLoaded && trip &&
                        <TripDetailScreenContent tripId={trip.tripId} navigation={navigation} />}
                </Content>
                <ActionButton
                    buttonColor="#2eb82e"
                    position="center"
                    onPress={this._confirmExportInfographic}
                    renderIcon={() => 
                        <View style={{alignItems: "center"}}>
                            <Icon name="md-checkmark" style={styles.actionButtonIcon} />
                            <Text style={{color: "white"}}>Done</Text>
                        </View> }
                    >                    
                </ActionButton>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white'
    },
  });

