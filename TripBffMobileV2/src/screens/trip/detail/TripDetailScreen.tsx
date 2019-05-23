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
import NBTheme from "../../../theme/variables/commonColor.js";

export interface IMapDispatchToProps {
    addInfographicId: (tripId: string, infographicId: string) => void;
}

export interface Props {
    tripId: string,
    navigation: RNa.NavigationScreenProp<any, any>;
}

interface State {
    isDisplayLoading: boolean
}

export class TripDetailScreen extends Component<Props & IMapDispatchToProps, State> {

    constructor(props) {
        super(props)

        this.state = {
            isDisplayLoading: true
        }
    }

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

    private _exportInfographic = () => {
        var tripId = this.props.tripId;
        this.props.navigation.navigate(NavigationConstants.Screens.TripsInfographicPreivew, { tripId: tripId });       
    }

    render() {
        const tripId = this.props.tripId;
        const navigation = this.props.navigation;

        return (
            <Container>
                <Content>
                    <TripDetailScreenContent tripId={tripId} navigation={navigation}/>                    
                </Content>
                <ActionButton
                    buttonColor={NBTheme.brandSuccess}
                    position="center"
                    onPress={this._exportInfographic}
                    renderIcon={() => 
                        <View style={{alignItems: "center"}}>
                            <Icon name="md-share-alt" style={styles.actionButtonIcon} />
                        </View> }
                />                     
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