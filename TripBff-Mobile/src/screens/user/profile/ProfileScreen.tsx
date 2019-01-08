import React, { Component } from "react";
import { Container, Header, Content, Text } from "native-base";
import _ from "lodash";
import Loading from "../../_components/Loading";
import { TripsComponent } from "../../trips/TripsComponent";

export interface IStateProps {}

interface IMapDispatchToProps {
  loginUsingUserPass: (email: string, password: string) => Promise<any>;
  fetchTrips: () => Promise<any>;
}

export interface Props extends IMapDispatchToProps {}

interface State {
  isLoaded: boolean;
  loadingMessage: string;
  trips: Array<any>;
  UIState: UIState;
}

type UIState = "LOGIN" | "LOADING_TRIP" | "NORMAL";

//todo add profile component
//todo check if logged or not, then load components appropriately
export class ProfileScreen extends Component<Props & IStateProps, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoaded: true,
      loadingMessage: "Logining",
      trips: [],
      UIState: "LOGIN"
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

      this.props.fetchTrips()
      .then(res => {
        console.log("fetchTrips", res.data);

        const fakedata = [
          {}, {}, {}
        ]
        this.setState({
          isLoaded: false,
          loadingMessage: "",
          UIState: "NORMAL",
          trips: fakedata
        });
      });
    }
  }

  render() {
    const { trips, isLoaded } = this.state;
    console.log("screen render", isLoaded)
    return (
      <Container>
        <Header />
        <Content>
          {isLoaded && <Loading message={this.state.loadingMessage} />}
          <TripsComponent trips={trips} />
        </Content>
      </Container>
    );
  }
}
