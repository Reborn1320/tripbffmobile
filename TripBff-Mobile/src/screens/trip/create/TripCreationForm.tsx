import React, { PureComponent, Component } from "react";
import { Button, Text, View } from 'native-base';
import { Form, Item, Label, Input, DatePicker } from 'native-base';
import moment, { Moment } from "moment";
import DateRangePicker from "../../../_atoms/DatePicker/DateRangePicker";

export interface Props {
    createTrip: (name: string, fromDate: Moment, toDate: Moment) => Promise<string>;
    onTripCreatedUpdatedHandler?: (tripId: string, name: string) => void;
    updateTrip: (tripId: string, name: string, fromDate: Moment, toDate: Moment) => Promise<any>;
}

export class TripCreationForm extends PureComponent<Props, any> {

  constructor(props) {
    super(props);
    this.state = { 
      tripId: '',
      isOpenDateRangePickerModal: false,
      fromDate: moment(),
      toDate: moment()
    };
  }

  private _onClickCreateTrip = () => {
    let tripId = this.state.tripId,
        tripName = this.state.tripName,
        fromDate = moment(this.state.fromDate).startOf('day'),
        toDate = moment(this.state.toDate).endOf('day');

    if (tripId) {
      this.props.updateTrip(tripId, tripName, fromDate, toDate)
      .then(() => {
        this.props.onTripCreatedUpdatedHandler(tripId, tripName);
      });       
    }
    else {
      this.props.createTrip(tripName, fromDate, toDate)
      .then(tripId => {
          this.setState({ tripId: tripId });
          this.props.onTripCreatedUpdatedHandler(tripId, tripName);
      });
    }    
  }  

  private _openDateRangePickerModal = () => {
    this.setState({
      isOpenDateRangePickerModal: true
    });
  }

  private _confirmHandler = (fromDate: Moment, toDate: Moment) => {
    this.setState({
      isOpenDateRangePickerModal: false,
      fromDate: fromDate,
      toDate: toDate
    });
  }

  private _cancelHandler = () => {
    this.setState({
      isOpenDateRangePickerModal: false
    });
  }

  renderImportBtn() {
    return (
      <Button
        style={{ alignSelf: 'center' }}
        onPress={this._onClickCreateTrip}>
        <Text>Create</Text>
      </Button>
    );
  }

  render() {
    //todo move style to dedicated var
    return (
      <View>
        <Form>
            <Item fixedLabel>
              <Label>Trip Name</Label>
              <Input
                onChangeText={(tripName) => this.setState({ tripName })} />
            </Item>
            <Item style={{height: 50}}>
              <Label>From Date</Label>
              <Text onPress={this._openDateRangePickerModal}>{this.state.fromDate.format('DD/MM/YYYY')}</Text>
            </Item>
            <Item style={{height: 50}}>
              <Label>End Date</Label>
              <Text onPress={this._openDateRangePickerModal}>{this.state.toDate.format('DD/MM/YYYY')}</Text>
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
        <DateRangePicker 
            isVisible={this.state.isOpenDateRangePickerModal}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
            cancelHandler={this._cancelHandler}
            confirmHandler={this._confirmHandler}>            
        </DateRangePicker>    
      </View>   
    );
  }
}