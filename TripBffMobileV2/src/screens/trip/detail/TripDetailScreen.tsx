import React, { Component } from "react";
import { Container, Header, Content, Button, Text, View, Icon } from 'native-base';
import { Alert, StyleSheet, TouchableOpacity, Image, RefreshControl } from "react-native";
import { AndroidBackHandler } from "react-navigation-backhandler";
import _, { } from "lodash";
import { tripApi } from "../../_services/apis";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import * as RNa from "react-navigation";
import TripDetailScreenContent from "./TripDetailScreenContent";
import ActionButton from 'react-native-action-button';
import NBTheme from "../../../theme/variables/commonColor.js";
import Loading from "../../../_atoms/Loading/Loading";
import { getCancelToken } from "../../../_function/commonFunc";
import Flurry from 'react-native-flurry-sdk';
import { StoreData } from "../../../store/Interfaces";
import { connect } from "react-redux";

interface IMapDispatchToProps {
    addInfographicId: (tripId: string, infographicId: string) => void;
    fetchTrip: (tripId: string, cancelToken: any, createdById: string) => Promise<void>
}

interface Props {
    tripId: string,
    tripName: string,
    createdById: string,
    navigation: RNa.NavigationScreenProp<any, any>;
}

interface State {
    isDisplayLoading: boolean,
    refreshing: boolean
}

class TripDetailScreenComponent extends Component<Props & IMapDispatchToProps, State> {

    _cancelToken;
    _cancelRequest;

    constructor(props) {
        super(props)

        this.state = {
            isDisplayLoading: false,
            refreshing: false
        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerLeft:  <RNa.HeaderBackButton tintColor={NBTheme.colorBackBlack} onPress={navigation.getParam('_goProfile')}/>,
        title: navigation.getParam('title'),
        headerRight:  (<TouchableOpacity style={styles.settingButtonContainer}
                                onPress={navigation.getParam('_goEditBasicTrip')}>
                            <Icon style={styles.editIcon} name='pencil-alt' type="FontAwesome5" />
                    </TouchableOpacity>)
      });

    componentWillUnmount() {
        this._cancelRequest('Operation canceled by the user.');
        Flurry.endTimedEvent('Trip Details');
    }

    componentDidMount() {
        Flurry.logEvent('Trip Details', null, true);
        this.props.navigation.setParams({ _goProfile: this._handleBackPress });
        this.props.navigation.setParams({ _goEditBasicTrip: this._onPopupMenuSelect });
        this._changeThisTitle(this.props.tripName);

        let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
        this._cancelToken = cancelToken;
        this._cancelRequest = cancelRequest;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tripName != this.props.tripName)
            this._changeThisTitle(this.props.tripName);
    }

    private _changeThisTitle = (titleText) => {
        const {setParams} = this.props.navigation;
        setParams({ title: titleText })
    }

    private _onPopupMenuSelect = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.TripEditBasic);
    }
    
    private _handleBackPress = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.Profile);
        return true;
    }

    private _exportInfographic = () => {
        var tripId = this.props.tripId;
        this.props.navigation.navigate(NavigationConstants.Screens.TripsInfographicPreivew, { tripId: tripId });       
    }

    private _refreshTrip = () => {
        const createdById = this.props.createdById;

        this.props.fetchTrip(this.props.tripId, this._cancelToken, createdById)
            .then(() => this.setState({
                isDisplayLoading: false,
                refreshing: false
            }));
    }

    private _onRefresh = () => {
        this.setState({
            refreshing: true,
            isDisplayLoading: true
        });
        this._refreshTrip();
    }

    render() {
        const tripId = this.props.tripId;
        const navigation = this.props.navigation;
        const { isDisplayLoading } = this.state;
        const canContribute = navigation.getParam('canContribute');

        return (
            <Container>
                <AndroidBackHandler onBackPress={this._handleBackPress} />
                <Content refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh} />}>
                    {isDisplayLoading &&  <Loading message={''}/> }
                    <TripDetailScreenContent tripId={tripId} navigation={navigation} canContribute={canContribute} />                    
                </Content>
                <ActionButton
                    buttonColor={NBTheme.colorRosy}
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

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    var trip = storeState.currentTrip;
    
    return {
        tripName: trip.name,
        createdById: trip.createdById
    };
};

export const TripDetailScreen = connect(
    mapStateToProps,
    null
)(TripDetailScreenComponent);

const styles = StyleSheet.create({
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    },
    settingButtonContainer: {
        marginRight: 15
    },
    settingIcon: {
        fontSize: 24
    },
    editIcon: {
        fontSize: 18
    }
  });