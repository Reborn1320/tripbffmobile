import React, { Component } from "react";
import { Container, Content, View } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import { PropsBase } from "../../_shared/LayoutContainer";
import * as RNa from "react-navigation";
import { mixins } from "../../../_utils";
import TripDetailScreenContent from "../detail/TripDetailScreenContent";
import { StyleSheet, BackHandler, TouchableOpacity } from "react-native";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Loading from "../../../_atoms/Loading/Loading";
import NBTheme from "../../../theme/variables/material.js";

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
    isDisplayLoading: boolean
}

export class TripEditScreen extends Component<Props, State> {

    _didFocusSubscription;
    _willBlurSubscription;
    _backHardwareHandler;

    constructor(props: Props) {
        super(props)
        this.state = {
            isDisplayLoading: !this.props.trip,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerLeft:  <RNa.HeaderBackButton onPress={navigation.getParam('_goBack')} />,
        headerRight:  (<TouchableOpacity style={styles.settingButtonContainer}
                                onPress={navigation.getParam('_goEditBasicTrip')}>
                            <Icon name="md-settings" style={styles.settingIcon}></Icon>
                     </TouchableOpacity>)
     });

    componentDidMount() {
        var tmp = this;

        this._didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
              console.debug('didFocus trip edit');
              tmp._backHardwareHandler = BackHandler.addEventListener('hardwareBackPress', this._goBackAndRefreshTripLists);
            }
          );
          
        this._willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                console.debug('willBlur trip edit');                
                tmp._backHardwareHandler.remove();
            }
        );

        this.props.navigation.setParams({ _goBack: this._goBackAndRefreshTripLists });
        this.props.navigation.setParams({ _goEditBasicTrip: this._onPopupMenuSelect });
        
        if (!this.props.trip) {
            this.props.fetchTrip(this.props.tripId)
            .then(() => this.setState({
                isDisplayLoading: false
            }));
        } 
    }z

    componentWillUnmount() {
        if (this._didFocusSubscription) this._didFocusSubscription.remove();
        if (this._willBlurSubscription) this._willBlurSubscription.remove();
        if (this._backHardwareHandler) this._backHardwareHandler.remove();
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

    render() {
        const { trip, navigation } = this.props;
        const { isDisplayLoading } = this.state;
        return (
            <Container>
                <Content>
                    {isDisplayLoading &&  <Loading message={''}/> }
                    {trip &&
                        <TripDetailScreenContent tripId={trip.tripId} navigation={navigation} />}                   
                </Content>
                {
                    trip && 
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
    settingButtonContainer: {
        marginRight: 15
    },
    settingIcon: {
        fontSize: 24
    }
  });

