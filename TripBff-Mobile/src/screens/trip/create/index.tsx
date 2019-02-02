import React, { Component } from "react";
import { Container, Header, Content, Text, View } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import { connect } from "react-redux";
import { createTrip } from './actions';
import moment from "moment";
import { PropsBase } from "../../_shared/LayoutContainer";
import { TripCreationForm } from "./TripCreationForm";

export interface Props extends IMapDispatchToProps, PropsBase {
  user: StoreData.UserVM
}

interface IMapDispatchToProps {
  createTrip: (trip: StoreData.TripVM) => void
}

class TripCreation extends Component<Props, any> {

  constructor(props) {
    super(props);
    this.state = { chosenDate: new Date() };
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  onTripCreated(tripVM: any) {
    const { tripId } = tripVM;

    // map trip info into Store
    var trip: StoreData.TripVM = {
      tripId: tripId,
      name: this.state.tripName,
      fromDate: moment(this.state.fromDate).startOf('day'),
      toDate: moment(this.state.toDate).endOf('day'),
      locations: [],
      infographicId: ''
    };
    this.props.createTrip(trip);

    // navigate to Trip Import page
    this.props.navigation.navigate("TripImportation", { tripId: tripId });
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
          <TripCreationForm onTripCreated={this.onTripCreated} />
        </Content>
      </Container>
    );
  }
}

const mapDispatchToProps: IMapDispatchToProps = {
  createTrip
};

const TripCreationScreen = connect(null, mapDispatchToProps)(TripCreation);

export default TripCreationScreen;
