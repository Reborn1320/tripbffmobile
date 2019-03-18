import React, { Component } from "react";
import { Button, Text, View } from 'native-base';
import { Form, Item, Label, Input } from 'native-base';
import moment, { Moment } from "moment";
import DatePicker from "../../_atoms/DatePicker/DatePicker";
import { mixins } from "../../_utils";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import _ from "lodash";

export interface Props {
  onClickEdit: (name: string, fromDate: Moment, toDate: Moment) => void;
  onCancel?: () => void;
  fromDate: Moment;
  toDate: Moment;

  fields: Array<TripDateRangeFormEnum>;
}

interface State {
  tripName: string;
  fromDate: Moment;
  toDate: Moment;
}

export enum TripDateRangeFormEnum {
  Name,
  DateRange,
}

export class TripDateRangeForm extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      tripName: undefined,
      fromDate: props.fromDate.utc(false),
      toDate: props.toDate.utc(false),
    };
  }

  private displayField(fieldEnum: TripDateRangeFormEnum) {
    return _.indexOf(this.props.fields, fieldEnum) !== -1;
  }

  private formValid() {
    return this.state.tripName && this.state.fromDate && this.state.toDate;
  }

  private renderEditBtn() {
    return (
      <Button
        style={{ alignSelf: 'center' }}
        onPress={() => this.props.onClickEdit(this.state.tripName, this.state.fromDate, this.state.toDate)}>
        <Text>Edit</Text>
      </Button>
    );
  }

  render() {
    return (
      <Form style={styles.formContainer}>
        {this.displayField(TripDateRangeFormEnum.Name) &&
          <Item regular inlineLabel style={styles.item}>
            <Label>Trip name</Label>
            <Input
              onChangeText={(tripName) => this.setState({ tripName })} />
          </Item>
        }
        {this.displayField(TripDateRangeFormEnum.DateRange) &&
          <Item regular inlineLabel style={styles.item}>
            <Label style={styles.itemLabel} >From date</Label>
            <DatePicker
              value={this.props.fromDate}
              onDateChange={(fromDate: Date) => this.setState({ fromDate: moment(fromDate) })}
            />
          </Item>
        }
        {this.displayField(TripDateRangeFormEnum.DateRange) &&
          <Item regular inlineLabel style={styles.item}>
            <Label style={styles.itemLabel}>To date</Label>
            <DatePicker
              value={this.props.toDate}
              onDateChange={(toDate: Date) => this.setState({ toDate: moment(toDate) })}
            />
          </Item>
        }
        <View style={styles.buttonsContainer}>
          {this.formValid() && this.renderEditBtn()}
          <Button transparent light
            style={{ alignSelf: 'center' }}
            onPress={() => { if (this.props.onCancel) this.props.onCancel() }}>
            <Text>Cancel</Text>
          </Button>
        </View>
      </Form>

    );
  }
}

interface Style {
  formContainer: ViewStyle;
  item: TextStyle;
  itemLabel: TextStyle;
  buttonsContainer: ViewStyle;
  buttonCancel: TextStyle;
}

const styles = StyleSheet.create<Style>({
  formContainer: {
    // ...mixins.themes.debug1,
    // padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch"
  },
  item: {
    marginBottom: 10,
    marginLeft: 0,
    borderRadius: 12,
    paddingLeft: 15,
    paddingRight: 15,
    height: 45,
  },
  itemLabel: {
    minWidth: 100,
  },
  buttonsContainer: {
    justifyContent: 'center',
    flexDirection: "row",
  },
  buttonCancel: {
    color: "white"
  }
})
