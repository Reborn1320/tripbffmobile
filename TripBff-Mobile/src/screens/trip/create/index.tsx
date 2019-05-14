import React, { Component } from "react";
import { Container, Header, Content, Text, View, Footer } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import { connect } from "react-redux";
import { createTrip } from './actions';
import moment, { Moment } from "moment";
import { PropsBase } from "../../_shared/LayoutContainer";
import { TripCreationForm } from "./TripCreationForm";
import { createTrip as createTripAsync } from "../../../store/Trip/operations";
import { loginUsingUserPass } from "../../../store/User/operations";
import AppFooter from "../../shared/AppFooter"
import { NavigationConstants } from "../../_shared/ScreenConstants";

export interface Props extends IMapDispatchToProps, PropsBase {
  user: StoreData.UserVM
}

interface IMapDispatchToProps {
  createTripAsync: (name: string, fromDate: Moment, toDate: Moment) => Promise<string>;
  loginUsingUserPass: (email: string, password: string) => Promise<any>;
  createTrip: (trip: StoreData.TripVM) => void
}

class TripCreation extends Component<Props, any> {

  constructor(props) {
    super(props);
    this.state = { chosenDate: new Date() };
    this.setDate = this.setDate.bind(this);
  }

  componentWillMount() {
    // this.props.loginUsingUserPass("aaa", "bbb");
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  onTripCreated = (tripVM: StoreData.TripVM) => {
    console.log("tripVM", tripVM);
    this.props.createTrip(tripVM);
    // navigate to Trip Import page
    this.props.navigation.navigate("TripImportation", { tripId: tripVM.tripId });
  }

  render() {

    return (
      <Container>
        <Header>
          <View style={{ height: 100, paddingTop: 30, flex: 1 }}>
            <Text style={{ color: "white" }}>Create new trip</Text>
          </View>
        </Header>
        <Content>
          <TripCreationForm createTrip={this.props.createTripAsync} onTripCreated={this.onTripCreated} />
        </Content>
        <Footer>
          <AppFooter navigation={this.props.navigation} activeScreen={NavigationConstants.Screens.TripCreation} />
        </Footer>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createTrip: (trip) => dispatch(createTrip(trip)),
    createTripAsync: (name, fromDate, toDate) => dispatch(createTripAsync(name, fromDate, toDate)),
    loginUsingUserPass: (email, password) => dispatch(loginUsingUserPass(email, password)),
  }
};

const TripCreationScreen = connect(null, mapDispatchToProps)(TripCreation);

export default TripCreationScreen;
