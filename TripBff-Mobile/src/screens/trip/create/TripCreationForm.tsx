import React, { Component } from "react";
import { Button, Text, View } from 'native-base';
import { Form, Item, Label, Input, DatePicker } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import { tripApi } from "../../_services/apis";
import moment, { Moment } from "moment";

export interface Props {
    createTrip: (name: string, fromDate: Moment, toDate: Moment) => Promise<string>;
    onTripCreated?: (tripVM: StoreData.TripVM) => void;
}

export class TripCreationForm extends Component<Props, any> {

  constructor(props) {
    super(props);
    this.state = { chosenDate: new Date() };
    this.setDate = this.setDate.bind(this); //todo handler this properly
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  //todo move to redux-thunk
  onClickCreateTrip() {
    console.log('cliked')

    // call ajax to create trip and get tripId
    var tripPost = {
      name: this.state.tripName,
      fromDate: moment(this.state.fromDate).startOf('day'),
      toDate: moment(this.state.toDate).endOf('day')
    };
    this.props.createTrip(tripPost.name, tripPost.fromDate, tripPost.toDate)
    .then(tripId => {
      // map trip info into Store
      var trip: StoreData.TripVM = {
        tripId: tripId,
        ...tripPost,
        locations: [],
        infographicId: ''
      };

      this.props.onTripCreated(trip);
    });
  }

  renderImportBtn() {
    return (
      <Button
        style={{ alignSelf: 'center' }}
        onPress={() => this.onClickCreateTrip()}>
        <Text>Import</Text>
      </Button>
    );
  }

  render() {
    //todo move datepicker with complicated configuration to atom, only expose simple props
    //todo move style to dedicated var
    return (
      <Form>
        <Item fixedLabel>
          <Label>Trip Name</Label>
          <Input
            onChangeText={(tripName) => this.setState({ tripName })} />
        </Item>
        <Item>
          <Label>From Date</Label>
          <DatePicker
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select Date"
            textStyle={{ color: "orange" }}
            placeHolderTextStyle={{ color: "#a6a6a6" }}
            onDateChange={(fromDate: Date) => this.setState({ fromDate })}

          />
        </Item>
        <Item>
          <Label>End Date</Label>
          <DatePicker
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select Date"
            textStyle={{ color: "orange" }}
            placeHolderTextStyle={{ color: "#a6a6a6" }}
            onDateChange={(toDate: Date) => this.setState({ toDate })}

          />
        </Item>
        <View style={{
          width: '100%',
          height: '30%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {!(this.state.tripName && this.state.fromDate && this.state.toDate) || this.renderImportBtn()}
        </View>

      </Form>
    );
  }
}