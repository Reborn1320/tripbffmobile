import React, { Component } from "react";
import { Container, Header, Content, View, Button, Text } from 'native-base';
import { Dimensions } from "react-native";
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import { PropsBase } from "../../_shared/LayoutContainer";
import * as RNa from "react-navigation";
import { mixins } from "../../../_utils";
import TripDetailScreenContent from "../detail/TripDetailScreenContent";
import { Alert, StyleSheet, BackHandler } from "react-native";
import { tripApi } from "../../_services/apis";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Loading from "../../../_atoms/Loading/Loading";
import NBTheme from "../../../theme/variables/commonColor.js";

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
    _didBlurSubscription;
    _backHardwareHandler;

    constructor(props: Props) {
        super(props)
        this.state = {
            isDisplayLoading: !this.props.trip,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerLeft:  <RNa.HeaderBackButton tintColor={'#fff'}          
           onPress={navigation.getParam('_goBack')}
         />
     });

    componentDidMount() {
        var tmp = this;

        this._didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
              console.debug('didFocus');
              tmp._backHardwareHandler = BackHandler.addEventListener('hardwareBackPress', this._goBackAndRefreshTripLists);
            }
          );
          
        this._didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                console.debug('didBlur');                
                tmp._backHardwareHandler.remove();
            }
        );

        this.props.navigation.setParams({ _goBack: this._goBackAndRefreshTripLists });
        
        if (!this.props.trip) {
            this.props.fetchTrip(this.props.tripId)
            .then(() => this.setState({
                isDisplayLoading: false
            }));
        } 
    }z

    componentWillUnmount() {
        this._didFocusSubscription.remove();
        this._didBlurSubscription.remove();
        this._backHardwareHandler.remove();
    }

    private _goBackAndRefreshTripLists = () => {
        let onGoBackCallBack = this.props.navigation.getParam("onGoBackProfile");
        if (onGoBackCallBack) onGoBackCallBack();
    
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
                        buttonColor={NBTheme.brandSuccess}
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
    }
  });

