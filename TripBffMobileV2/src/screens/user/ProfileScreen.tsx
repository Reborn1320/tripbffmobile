import React, { Component } from "react";
import { Container, Content, Footer, View } from "native-base";
import _ from "lodash";
import Loading from "../../_atoms/Loading/Loading";
import { TripsComponent } from "../../_organisms/Trips/TripsList/TripsComponent";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { StoreData } from "../../store/Interfaces";
import { NavigationScreenProp } from "react-navigation";
import { Divider } from "react-native-elements";
import { UserDetails } from "../../_organisms/User/UserDetails";
import { logOut } from "../../store/User/operations";
import { getCancelToken } from "../../_function/commonFunc";
import ConfirmationModal from "../../_molecules/ConfirmationModal";

export interface IStateProps { }

interface IMapDispatchToProps {
    fetchTrips: (cancelToken: any) => Promise<any>;
    addTrips: (trips: Array<StoreData.TripVM>) => void;
    deleteTrip: (tripId: string) => void;
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
    deletedTripId: string,
    updatedTripId: string
}

type UIState = "LOGIN" | "LOADING_TRIP" | "NORMAL";

export class ProfileScreen extends Component<Props & IStateProps, State> {

    _cancelRequest;
    _cancelToken;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoaded: this.props.trips.length == 0,
            loadingMessage: "loading trips belong to this user",
            UIState: "LOADING_TRIP",
            isOpenDeleteConfirmModal: false,
            deletedTripId: "",
            updatedTripId: ""
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

    private _resetTripUpdatedId = () => {
        this.setState({
            updatedTripId: ""
        });
    }

    private _handleUpdatedTripGoBack = (tripId) => {
        this.setState({
            updatedTripId: tripId
        });
    }
    
    private handleTripItemClick(tripId: string) {
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
        let { userName, fullName, trips } = this.props;
        const { isLoaded, updatedTripId } = this.state;

        return (
            <Container>
                <Content>
                    <View>
                        <UserDetails 
                            userName={userName}
                            fullName={fullName}

                            nTrips={trips.length}
                            onClickEdit={this.handleEditBtnClick}
                        />
                        <Divider style={
                            {
                                marginTop: 20,
                                marginBottom: 20,
                            }
                        }></Divider>
                        {isLoaded && <Loading message={this.state.loadingMessage} />}
                        <TripsComponent
                            trips={trips}
                            updatedTripId={updatedTripId}
                            handleClick={tripId => this.handleTripItemClick(tripId)}
                            handleShareClick={this._handleShareBtnClick}
                            handleDeleteTrip={this._handleDeleteTrip}
                            handleResetTripUpdatedId={this._resetTripUpdatedId}
                        />
                        <ConfirmationModal title="DELETE TRIP" 
                            content="Do you want to delete this Trip ? Deleting a Trip will delete all the items you have added to it. The Trip cannot be retrived once it is deleted."
                            confirmHandler={this._confirmDeleteTrip}
                            cancelHandler={this._cancelDeleteModal}
                            isVisible={this.state.isOpenDeleteConfirmModal} />
                    </View>
                </Content>
            </Container>
        );
    }
}
