import React, { Component } from "react";
import { Container, Content, Footer, View } from "native-base";
import _ from "lodash";
import Loading from "../../_atoms/Loading/Loading";
import { TripsComponent } from "../../_organisms/Trips/TripsList/TripsComponent";
import AppFooter from "../shared/AppFooter";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { StoreData } from "../../store/Interfaces";
import { NavigationScreenProp } from "react-navigation";
import { Divider } from "react-native-elements";
import { UserDetails } from "../../_organisms/User/UserDetails";

export interface IStateProps { }

interface IMapDispatchToProps {
    loginUsingUserPass: (email: string, password: string) => Promise<any>;
    loginUsingFacebookAccessToken: (userId: string, accessToken: string) => Promise<any>;
    fetchTrips: () => Promise<any>;
    addTrips: (trips: Array<StoreData.TripVM>) => void;
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
}

type UIState = "LOGIN" | "LOADING_TRIP" | "NORMAL";

export class ProfileScreen extends Component<Props & IStateProps, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isLoaded: true,
            loadingMessage: "loading trips belong to this user",
            UIState: "LOADING_TRIP"
        };
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        this.props.fetchTrips().then(trips => {
            // console.log("fetched Trips", trips);

            this.props.addTrips(trips);

            this.setState({
                isLoaded: false,
                loadingMessage: "",
                UIState: "NORMAL",
            });
        });
    }

    private handleTripItemClick(tripId: string) {
        this.props.navigation.navigate(
            NavigationConstants.Screens.TripEdit,
            { tripId, id: tripId }
        );
    }

    private _handleShareBtnClick = (tripId) => {
        this.props.navigation.navigate(NavigationConstants.Screens.TripsInfographicPreivew, { tripId: tripId })
    }

    render() {
        const { userName, fullName, trips } = this.props;
        const { isLoaded } = this.state;

        return (
            <Container>
                {/* <Header /> */}
                <Content>
                    <View>
                        <UserDetails 
                            userName={userName}
                            fullName={fullName}

                            nTrips={trips.length}
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
                            handleClick={tripId => this.handleTripItemClick(tripId)}
                            handleShareClick={this._handleShareBtnClick}
                        />
                    </View>
                </Content>
                <Footer>
                    <AppFooter
                        navigation={this.props.navigation}
                        activeScreen={NavigationConstants.Screens.Profile}
                    />
                </Footer>
            </Container>
        );
    }
}
