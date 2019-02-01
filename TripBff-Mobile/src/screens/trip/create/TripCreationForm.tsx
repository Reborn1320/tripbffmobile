import React, { Component } from "react";
import { Button, Text, View } from 'native-base';
import { Form, Item, Label, Input, DatePicker } from 'native-base';
import { StoreData } from "../../../Interfaces";
import { tripApi } from "../../_services/apis";
import moment from "moment";

export interface Props {
  onTripCreated?: (tripVM: any) => void;
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
    tripApi.post('/trips', tripPost).then((res) => {
      var tripId = res.data;
      console.log('trip id: ' + tripId);

      // map trip info into Store
      var trip: StoreData.TripVM = {
        tripId: tripId,
        name: this.state.tripName,
        fromDate: moment(this.state.fromDate).startOf('day'),
        toDate: moment(this.state.toDate).endOf('day'),
        locations: [],
        infographicId: ''
      };

      this.props.onTripCreated(trip);
    })
      .catch((err) => {
        console.log('error create trip api: ' + JSON.stringify(err));
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