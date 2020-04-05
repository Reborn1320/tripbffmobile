import React, { Component } from "react";
import { Container, Content } from "native-base";
import { StoreData } from "../../../store/Interfaces";
import { connect } from "react-redux";
import moment, { Moment } from "moment";
import { PropsBase } from "../../_shared/LayoutContainer";
import TripCreationForm from "./TripCreationForm";
import {
  createTrip as createTripAsync,
  updateTrip,
} from "../../../store/Trip/operations";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import { withNamespaces } from "react-i18next";
import Flurry from 'react-native-flurry-sdk';

export interface Props extends IMapDispatchToProps, PropsBase {
  tripFromDate?: moment.Moment;
  tripToDate?: moment.Moment;
  userId: string;
}

interface IMapDispatchToProps {
  createTripAsync: (
    name: string,
    fromDate: Moment,
    toDate: Moment,
    isPublic: boolean,
    userId: string
  ) => Promise<string>;
  updateTrip: (
    tripId: string,
    name: string,
    fromDate: Moment,
    toDate: Moment,
    isPublic: boolean
  ) => Promise<any>;
}

interface State {}

class TripCreation extends Component<Props, State> {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: screenProps.t("create:screen_header_title"),
    };
  };

  componentDidMount() {
    Flurry.logEvent('Trip Creation', null, true);
    Flurry.logEvent('Trip Creation - Export Infographic', null, true);
  }
  

  componentWillUnmount() {
    Flurry.endTimedEvent('Trip Creation');
  }

  private _onCreatedOrUpdatedHandler = (tripId, tripName) => {
    this.props.navigation.navigate(NavigationConstants.Screens.TripImport, {
      tripId: tripId,
      otherParam: tripName,
    });
  };

  private _createTrip = (name, fromDate, toDate, isPublic) => {
    return this.props.createTripAsync(name, fromDate, toDate, isPublic, this.props.userId);
  }

  render() {
    return (
      <Container>
        <Content>
          <TripCreationForm
            createTrip={this._createTrip}
            updateTrip={this.props.updateTrip}
            onTripCreatedUpdatedHandler={this._onCreatedOrUpdatedHandler}
            titleButton={"action:next"}
            navigation={this.props.navigation}
            tripFromDate={this.props.tripFromDate}
            tripToDate={this.props.tripToDate}
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  var trip = storeState.currentTrip;

  return {
    tripFromDate: trip != null ? trip.fromDate : null,
    tripToDate: trip != null ? trip.toDate : null,
    userId: storeState.user.id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createTripAsync: (name, fromDate, toDate, isPublic, userId) =>
      dispatch(createTripAsync(name, fromDate, toDate, isPublic, userId)),
    updateTrip: (tripId, name, fromDate, toDate, isPublic) =>
      dispatch(updateTrip(tripId, name, fromDate, toDate, isPublic)),
  };
};

const TripCreationScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(TripCreation);

export default withNamespaces(["create", "action"])(TripCreationScreen);
