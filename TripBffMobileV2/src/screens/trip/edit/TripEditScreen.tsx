import React, { Component } from "react";
import { Container, Content, View, Icon } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import { PropsBase } from "../../_shared/LayoutContainer";
import * as RNa from "react-navigation";
import { mixins } from "../../../_utils";
import TripDetailScreenContent from "../detail/TripDetailScreenContent";
import { StyleSheet, TouchableOpacity, Image, RefreshControl, Text, ScrollView, SafeAreaView } from "react-native";
import { AndroidBackHandler } from "react-navigation-backhandler";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import ActionButton from 'react-native-action-button';
import Loading from "../../../_atoms/Loading/Loading";
import NBTheme from "../../../theme/variables/material.js";
import NBColor from "../../../theme/variables/commonColor.js";
import { getCancelToken } from "../../../_function/commonFunc";
import Flurry from 'react-native-flurry-sdk';
import Swiper from "react-native-swiper";
import TripInfographicComponent from "../../../_organisms/Trip/TripDetails/TripInfographic";

interface IMapDispatchToProps {
    addInfographicId: (tripId: string, infographicId: string) => void
    fetchTrip: (tripId: string, cancelToken: any, createdById: string) => Promise<void>
}

export interface Props extends IMapDispatchToProps, PropsBase {
    tripId: string,
    trip: StoreData.TripVM,
    navigation: RNa.NavigationScreenProp<any, any>;
    createdById: string;
}

interface State {
    isDisplayLoading: boolean,
    refreshing: boolean,
    stepIndex: number   
}

export class TripEditScreen extends Component<Props, State> {

    _cancelToken;
    _cancelRequest;

    constructor(props: Props) {
        super(props)
        this.state = {
            isDisplayLoading: !this.props.trip,
            refreshing: false,
            stepIndex: 0
        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerLeft:  <RNa.HeaderBackButton tintColor={NBColor.colorBackBlack} onPress={navigation.getParam('_goBack')} />,
        headerRight:   (navigation.getParam('canContribute') && <TouchableOpacity style={styles.settingButtonContainer}
                                onPress={navigation.getParam('_goEditBasicTrip')}>
                            <Icon style={styles.editIcon} name='pencil-alt' type="FontAwesome5" />
                     </TouchableOpacity>)
     });

    componentDidMount() {
        Flurry.logEvent('Trip Edit', null, true);
        this.props.navigation.setParams({ _goBack: this._goBackAndRefreshTripLists });
        this.props.navigation.setParams({ _goEditBasicTrip: this._onPopupMenuSelect });
        
        let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
        this._cancelToken = cancelToken;
        this._cancelRequest = cancelRequest;  
        
        if (!this.props.trip) {
            this._refreshTrip();
        }
    }

    componentWillUnmount() {
        this._cancelRequest('Operation canceled by the user.');
        Flurry.endTimedEvent('Trip Edit');
    }

    private _refreshTrip = () => {
        const createdById = this.props.navigation.getParam('createdById');

        this.props.fetchTrip(this.props.tripId, this._cancelToken, createdById)
            .then(() => this.setState({
                isDisplayLoading: false,
                refreshing: false
            }));
    }

    private _onPopupMenuSelect = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.TripEditBasic);
    }

    private _goBackAndRefreshTripLists = () => {
        let onGoBackCallBack = this.props.navigation.getParam("onGoBackProfile");
        if (onGoBackCallBack) onGoBackCallBack(this.props.tripId);
    
        this.props.navigation.goBack();
        return true;
    }

    private _exportInfographic = () => {
        var tripId = this.props.tripId;
        let onGoBackProfileCallBack = this.props.navigation.getParam("onGoBackProfile");

        this.props.navigation.navigate(NavigationConstants.Screens.TripsInfographicPreivew, { 
            tripId: tripId,
            onGoBackProfile: onGoBackProfileCallBack
        });       
    }

    private _onRefresh = () => {
        this.setState({
            refreshing: true,
            isDisplayLoading: true
        });
        this._refreshTrip();
    }

    private _onIndexChanged = (index) => {
        // if (index == 1 && !this.props.trip) {
        //     this._refreshTrip();
        // }

        this.setState({ stepIndex: index });
    }

    render() {
        const { trip, navigation } = this.props;
        const { isDisplayLoading, stepIndex } = this.state;
        const canContribute = navigation.getParam('canContribute');
        let infographicExternalId = trip ? trip.latestExportedExternalStorageId : "";      

        return (
            <SafeAreaView style={styles.container}>
                {
                    canContribute && 
                    <AndroidBackHandler onBackPress={this._goBackAndRefreshTripLists} />
                } 
                    <Swiper ref='swiper'
                        showsButtons={false}
                        loop={false} 
                        index={stepIndex} 
                        paginationStyle={styles.paginationStyle}                  
                        activeDotColor={NBColor.brandPrimary}
                        onIndexChanged={this._onIndexChanged}
                    >
                        <View style={{ flex: 1 }}>                            
                            { isDisplayLoading &&  <Loading message={''}/> }
                            { trip && <TripInfographicComponent tripId={trip.tripId} infographicExternalId={infographicExternalId} /> }
                        </View>
                        <ScrollView 
                            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
                        >
                            { isDisplayLoading &&  <Loading message={''}/> }
                            { trip &&
                                <TripDetailScreenContent tripId={trip.tripId} canContribute={canContribute} navigation={navigation} />} 
                        </ScrollView>                                       
                    </Swiper>  
                {
                    canContribute &&
                    <ActionButton
                        buttonColor={NBTheme.colorRosy}
                        position="center"
                        onPress={this._exportInfographic}
                        renderIcon={() => 
                            <View style={{alignItems: "center"}}>
                                <Icon name="md-share-alt" style={styles.actionButtonIcon} />
                            </View> }
                    />   
                }                
            </SafeAreaView>            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },    
    paginationStyle: {
        position: "absolute",
        bottom: "1%"
    },
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white'
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

