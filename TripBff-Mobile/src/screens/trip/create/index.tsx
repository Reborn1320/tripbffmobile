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
  updateTrip: (tripId: string, name: string, fromDate: Moment, toDate: Moment) => Promise<any>;
}

class TripCreation extends Component<Props, any> {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: 'Create new trip'
    };
  };

  private _onCreatedOrUpdatedHandler = (tripId, tripName) => {
    this.props.navigation.navigate(NavigationConstants.Screens.TripImport, {
        tripId: tripId,
        otherParam: tripName });
  }

  render() {
    return (
      <Container>
        <Content>
          <TripCreationForm createTrip={this.props.createTripAsync} 
                            updateTrip={this.props.updateTrip}
                            onTripCreatedUpdatedHandler={this._onCreatedOrUpdatedHandler} />
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
    createTripAsync: (name, fromDate, toDate) => dispatch(createTripAsync(name, fromDate, toDate))
  }
};

const TripCreationScreen = connect(null, mapDispatchToProps)(TripCreation);

export default TripCreationScreen;
