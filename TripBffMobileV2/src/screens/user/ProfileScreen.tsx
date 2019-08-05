import React, { Component } from "react";
import { Container, Content, Footer, View } from "native-base";
import _ from "lodash";
import Loading from "../../_atoms/Loading/Loading";
import TripsComponent from "../../_organisms/Trips/TripsList/TripsComponent";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { StoreData } from "../../store/Interfaces";
import { NavigationScreenProp } from "react-navigation";
import UserDetails from "../../_organisms/User/UserDetails";
import { logOut } from "../../store/User/operations";
import { getCancelToken } from "../../_function/commonFunc";
import ConfirmationModal from "../../_molecules/ConfirmationModal";
import { getLabel } from "../../../i18n";

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
            isLoaded: false,
            loadingMessage: "loading trips belong to this user",
            UIState: "LOADING_TRIP",
            isOpenDeleteConfirmModal: false,
            deletedTripId: ""
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
        this._cancelToken = cancelToken;
        this._cancelRequest = cancelRequest;

        this._refreshTrips();
    } 

    componentWillUnmount() {        
        this._cancelRequest('Operation canceled by the user.');
    }

    private _refreshTrips = () => {
        this.props.fetchTrips(this._cancelToken).then(trips => {
            this.props.addTrips(trips);
            this.setState({
                isLoaded: false,
                loadingMessage: "",
                UIState: "NORMAL",
            });
        });
    }

    private _handleUpdatedTripGoBack = (tripId) => {
        this.props.getCurrentMinimizedTrip(tripId);
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

    private handleEditBtnClick = () => {
        logOut()
        .then(() => {
            this.props.navigation.navigate(NavigationConstants.Screens.Login)
        })
    }

    render() {
        const { isLoaded } = this.state;

        return (
            <Container>
                <Content>
                    <View>
                        <UserDetails 
                            onClickEdit={this.handleEditBtnClick}
                        />
                        {isLoaded && <Loading message={this.state.loadingMessage} />}
                        <TripsComponent
                            handleClick={this._handleTripItemClick}
                            handleShareClick={this._handleShareBtnClick}
                            handleDeleteTrip={this._handleDeleteTrip}
                        />
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
