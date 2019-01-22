import React, { Component } from "react";
import { Container, Header, Content, Footer, View, Button } from "native-base";
import _ from "lodash";
import Loading from "../_components/Loading";
import { TripsComponent } from "../trips/TripsComponent";
import AppFooter from "../shared/AppFooter";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { PropsBase } from "../_shared/LayoutContainer";
import { StoreData } from "../../Interfaces";
import ConfirmationModal from "../../_molecules/ConfirmationModal";

export interface IStateProps { }

interface IMapDispatchToProps {
  loginUsingUserPass: (email: string, password: string) => Promise<any>;
  fetchTrips: () => Promise<any>;
  addTrips: (trips: Array<StoreData.TripVM>) => void;
}

export interface Props extends IMapDispatchToProps, PropsBase { }

interface State {
  isLoaded: boolean;
  loadingMessage: string;
  trips: Array<any>;
  UIState: UIState;
  isModalVisible: boolean;
}

type UIState = "LOGIN" | "LOADING_TRIP" | "NORMAL";

//todo add profile component
export class ProfileScreen extends Component<Props & IStateProps, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoaded: true,
      loadingMessage: "Logining",
      trips: [],
      UIState: "LOGIN",
      isModalVisible: false
    };
  }

  componentWillMount() {
    //dispatch redux-thunk login
    this.props.loginUsingUserPass("aaa", "bbb").then(() => {
      this.setState({
        loadingMessage: "loading trips belong to this user",
        UIState: "LOADING_TRIP"
      });
    });
  }

  componentDidUpdate() {
    if (this.state.UIState === "LOADING_TRIP") {
      //trigger event to load data
      console.log("LOADING_TRIP");

      this.props.fetchTrips().then(trips => {
        // console.log("fetched Trips", trips);

        this.props.addTrips(trips);

        this.setState({
          isLoaded: false,
          loadingMessage: "",
          UIState: "NORMAL",
          trips: trips
        });
      });
    }
  }

  handleTripItemClick(trip: any) {
    const { tripId } = trip;
    this.props.navigation.navigate(
      NavigationConstants.Screens.TripDetail,
      { tripId, id: tripId }
    );
  }
  _toggleConfirmationModal = () => this.setState({ isModalVisible: !this.state.isModalVisible })

  _onConfirm = () => this.setState({ isModalVisible: false })
  _onCancel = () => this.setState({ isModalVisible: false })

  render() {
    const { trips, isLoaded, isModalVisible } = this.state;
    // console.log("screen render", isLoaded);
    // console.log("screen render", trips);
    return (
      <Container>
        <Header />
        <Content>
          <View>
            <Button onPress={this._toggleConfirmationModal}>need your confirmation</Button>
            <ConfirmationModal isVisible={isModalVisible} content="You want confirm ??" confirmHandler={this._onConfirm} cancelHandler={this._onCancel}></ConfirmationModal>
            {isLoaded && <Loading message={this.state.loadingMessage} />}
            <TripsComponent
              trips={trips}
              handleClick={trip => this.handleTripItemClick(trip)}
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
