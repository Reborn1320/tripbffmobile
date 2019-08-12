import React, { Component } from "react";
import { Container, Content } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import { connect } from "react-redux";
import { Moment } from "moment";
import { PropsBase } from "../../_shared/LayoutContainer";
import TripCreationForm from "./TripCreationForm";
import { createTrip as createTripAsync, updateTrip } from "../../../store/Trip/operations";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import { withNamespaces } from "react-i18next";

export interface Props extends IMapDispatchToProps, PropsBase {
  user: StoreData.UserVM
}

interface IMapDispatchToProps {
  createTripAsync: (name: string, fromDate: Moment, toDate: Moment) => Promise<string>;
  updateTrip: (tripId: string, name: string, fromDate: Moment, toDate: Moment) => Promise<any>;
}

interface State {
}

class TripCreation extends Component<Props, State> {

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title:  screenProps.t('create:screen_header_title')
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
                            onTripCreatedUpdatedHandler={this._onCreatedOrUpdatedHandler}
                            titleButton={"action:next"} />
        </Content>        
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createTripAsync: (name, fromDate, toDate) => dispatch(createTripAsync(name, fromDate, toDate)),
    updateTrip: (tripId, name, fromDate, toDate) => dispatch(updateTrip(tripId, name, fromDate, toDate))
  }
};

const TripCreationScreen = connect(null, mapDispatchToProps)(TripCreation);

export default withNamespaces(['create', 'action'])(TripCreationScreen);
