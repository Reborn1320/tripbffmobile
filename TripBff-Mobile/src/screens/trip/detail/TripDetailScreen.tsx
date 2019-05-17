import React, { Component } from "react";
import { Container, Header, Content, Button, Text, View } from 'native-base';
import { Alert, BackHandler, StyleSheet } from "react-native";
import _, { } from "lodash";
import { tripApi } from "../../_services/apis";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import * as RNa from "react-navigation";
import TripDetailScreenContent from "./TripDetailScreenContent";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

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
                <Content>
                    <TripDetailScreenContent tripId={tripId} navigation={navigation} />
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
      color: 'white',
    },
  });