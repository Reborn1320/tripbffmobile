import React, { PureComponent, Component } from "react";
import { Button, Text, View, Form, Item, Label, Input } from 'native-base';
import moment, { Moment } from "moment";
import DateRangePicker from "../../../_atoms/DatePicker/DateRangePicker";
import NBColor from "../../../theme/variables/commonColor.js";
import { getLabel } from "../../../../i18n";

export interface Props {
    createTrip?: (name: string, fromDate: Moment, toDate: Moment) => Promise<string>;
    onTripCreatedUpdatedHandler?: (tripId: string, name: string) => void;
    updateTrip: (tripId: string, name: string, fromDate: Moment, toDate: Moment) => Promise<any>;
    tripId?: string,
    tripName?: string,
    tripFromDate?: moment.Moment,
    tripToDate?: moment.Moment,
    titleButton: string
}

export class TripCreationForm extends PureComponent<Props, any> {

  constructor(props) {
    super(props);

    this.state = { 
      tripId: this.props.tripId,
      tripName: this.props.tripName,
      isOpenDateRangePickerModal: false,
      fromDate: this.props.tripFromDate ? this.props.tripFromDate : moment(),
      toDate: this.props.tripToDate ? this.props.tripToDate : moment()
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
        style={{ alignSelf: 'center', backgroundColor: NBColor.brandMainColor }}
        onPress={this._onClickCreateTrip}>
          <Text>{getLabel(this.props.titleButton)}</Text>
      </Button>
    );
  }

  render() {
    //todo move style to dedicated var
    return (
      <View>
        <Form>
            <Item fixedLabel>
              <Label>{getLabel("create.trip_name")}</Label>
              <Input
                value={this.state.tripName}
                onChangeText={(tripName) => this.setState({ tripName })} />
            </Item>
            <Item style={{height: 50}}>
              <Label>{getLabel("create.from_date")}</Label>
              <Text onPress={this._openDateRangePickerModal}>{this.state.fromDate.format('DD/MM/YYYY')}</Text>
            </Item>
            <Item style={{height: 50}}>
              <Label>{getLabel("create.end_date")}</Label>
              <Text onPress={this._openDateRangePickerModal}>{this.state.toDate.format('DD/MM/YYYY')}</Text>
            </Item>
          
            <View style={{
              marginTop: 20,
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