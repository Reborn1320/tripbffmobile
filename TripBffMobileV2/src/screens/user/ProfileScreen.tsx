import React, { Component } from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { Container, Content, Footer, View } from "native-base";
import _ from "lodash";
import Loading from "../../_atoms/Loading/Loading";
import TripsComponent from "../../_organisms/Trips/TripsList/TripsComponent";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { StoreData } from "../../store/Interfaces";
import { NavigationScreenProp } from "react-navigation";
import UserDetails from "../../_organisms/User/UserDetails";
import { getCancelToken } from "../../_function/commonFunc";
import ConfirmationModal from "../../_molecules/ConfirmationModal";
import { getLabel } from "../../../i18n";
import TripsEmptyComponent from "../../_organisms/Trips/TripsList/TripsEmptyComponent";

export interface IStateProps { }

interface IMapDispatchToProps {
    fetchTrips: (cancelToken: any) => Promise<any>;
    addTrips: (trips: Array<StoreData.TripVM>) => void;
    deleteTrip: (tripId: string) => void;
    getCurrentMinimizedTrip: (tripId: string) => void;
}

export interface Props extends IMapDispatchToProps {
    navigation: NavigationScreenProp<any, any>;

    userName: string;
    fullName: string;

    trips: StoreData.MinimizedTripVM[];
}

interface State {
    isLoaded: boolean;
    loadingMessage: string;
    UIState: UIState;
    isEmptyTrips: boolean;
    isOpenDeleteConfirmModal: boolean,
    deletedTripId: string
}

type UIState = "LOGIN" | "LOADING_TRIP" | "NORMAL";

export class ProfileScreen extends Component<Props & IStateProps, State> {

    _cancelRequest;
    _cancelToken;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoaded: true,
            loadingMessage: getLabel("profile.loading_trips_message"),
            UIState: "LOADING_TRIP",
            isEmptyTrips: false,
            isOpenDeleteConfirmModal: false,
            deletedTripId: ""
        };
    }

    static navigationOptions = ({ navigation }) => ({
        headerRight: (<TouchableOpacity style={styles.settingButtonContainer}
                                onPress={navigation.getParam('_editUserSettings')}>
                            <Image                               
                                source={require('../../../assets/Setting.png')}
                            />
                    </TouchableOpacity>)
    });

    componentDidMount() {
        let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
        this._cancelToken = cancelToken;
        this._cancelRequest = cancelRequest;

        this._refreshTrips();
        this.props.navigation.setParams({ _editUserSettings: this._editUserSettings });
    } 

    componentWillUnmount() {        
        this._cancelRequest('Operation canceled by the user.');
    }

    private _editUserSettings = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.UserSettingsScreen);
    }

    private _refreshTrips = () => {
        this.props.fetchTrips(this._cancelToken).then(trips => {
            this.props.addTrips(trips);
            this.setState({
                isLoaded: false,
                isEmptyTrips: !trips || trips.length == 0,
                loadingMessage: "",
                UIState: "NORMAL",
            });
        });
    }

    private _handleUpdatedTripGoBack = (tripId) => {
        this.props.getCurrentMinimizedTrip(tripId);
    }
    
    private _handleCreateBtnClick = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.TripCreation);
    }

    private _handleTripItemClick = (tripId: string) => {
        this.props.navigation.navigate(
            NavigationConstants.Screens.TripEdit,
            { 
              tripId: tripId,
              onGoBackProfile: this._handleUpdatedTripGoBack
            }
        );
    }

    private _handleShareBtnClick = (tripId) => {
        this.props.navigation.navigate(NavigationConstants.Screens.TripsInfographicPreivew, { 
            tripId: tripId,
            onGoBackProfile: this._refreshTrips,
            isFromProfile: true
        })
    }

    private _handleDeleteTrip = (tripId) => {
        this.setState({
            isOpenDeleteConfirmModal: true,
            deletedTripId: tripId
        });
    }

    private _confirmDeleteTrip = () => {
        this.props.deleteTrip(this.state.deletedTripId);
        this.setState({
            isOpenDeleteConfirmModal: false,
            deletedTripId: ""
        });
    }

    private _cancelDeleteModal = () => {
        this.setState({
            isOpenDeleteConfirmModal: false,
            deletedTripId: ""
        });
    }   

    render() {
        const { isLoaded, isEmptyTrips } = this.state;

        return (
            <Container>
                <Content>
                    <View style={{flex: 1}}>
                        <UserDetails />
                        {isLoaded && <Loading message={this.state.loadingMessage} />}
                        {
                            !isLoaded && isEmptyTrips &&
                            <TripsEmptyComponent handleCreateClick={this._handleCreateBtnClick}></TripsEmptyComponent>
                        }
                        {
                            !isEmptyTrips && 
                            <TripsComponent
                                handleClick={this._handleTripItemClick}
                                handleShareClick={this._handleShareBtnClick}
                                handleDeleteTrip={this._handleDeleteTrip}
                            />
                        }
                        <ConfirmationModal title={getLabel("profile.delete_trip_modal_header")}
                            content={getLabel("profile.delete_trip_modal_content")}
                            confirmHandler={this._confirmDeleteTrip}
                            cancelHandler={this._cancelDeleteModal}
                            isVisible={this.state.isOpenDeleteConfirmModal} />
                    </View>
                </Content>
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
    settingButtonContainer: {
        marginRight: 15
    },
    settingIcon: {
        fontSize: 24
    }
  });