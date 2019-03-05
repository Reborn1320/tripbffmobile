import React, { Component } from "react";
import { Button, Text, View } from 'native-base';
import { Form, Item, Label, Input } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import { tripApi } from "../../../screens/_services/apis";
import moment, { Moment } from "moment";
import DatePicker from "../../../_atoms/DatePicker/DatePicker";

export interface Props {
  onClickEdit: (fromDate: Moment, toDate: Moment) => void;
  fromDate: Moment;
  toDate: Moment;
}

interface State {
  fromDate: Moment;
  toDate: Moment;
}

export class TripDateRangeForm extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      fromDate: props.fromDate,
      toDate: props.toDate,
    };
  }

  formValid() {
    return this.state.fromDate && this.state.toDate;
  }

  renderImportBtn() {
    return (
      <Button
        style={{ alignSelf: 'center' }}
        onPress={() => this.props.onClickEdit(this.state.fromDate, this.state.toDate)}>
        <Text>Edit</Text>
      </Button>
    );
  }

  render() {
    return (
      <Form>
        <Item>
          <DatePicker
            labelText="From Date"
            value={this.props.fromDate}
            onDateChange={(fromDate: Date) => this.setState({ fromDate: moment(fromDate) })}
          />
        </Item>
        <Item>
          <DatePicker
            labelText="To Date"
            value={this.props.toDate}
            onDateChange={(toDate: Date) => this.setState({ toDate: moment(toDate) })}
          />
        </Item>
        <View style={{
          width: '100%',
          height: '30%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {this.formValid() && this.renderImportBtn()}
        </View>
      </Form>
    );
  }
}