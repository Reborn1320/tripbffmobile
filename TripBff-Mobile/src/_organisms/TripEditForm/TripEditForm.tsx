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
  tripName?: string;
  fromDate?: Moment;
  toDate?: Moment;

  fields: Array<TripEditFormEnum>;
}

interface State {
  tripName: string;
  fromDate: Moment;
  toDate: Moment;
}

export enum TripEditFormEnum {
  Name,
  DateRange,
}

export class TripEditForm extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      tripName: props.tripName,
      fromDate: props.fromDate ? props.fromDate.utc(false): null,
      toDate: props.toDate ? props.toDate.utc(false): null,
    };
  }

  private displayField(fieldEnum: TripEditFormEnum) {
    return _.indexOf(this.props.fields, fieldEnum) !== -1;
  }

  private formValid() {
    if (this.props.fields.indexOf(TripEditFormEnum.Name) != -1 && !this.state.tripName) return false;
    if (this.props.fields.indexOf(TripEditFormEnum.DateRange) != -1 && !(this.state.fromDate && this.state.toDate)) return false;
    return true;
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
        {this.displayField(TripEditFormEnum.Name) &&
          <Item regular inlineLabel style={styles.item}>
            <Label>Trip name</Label>
            <Input
              value={this.props.tripName}
              onChangeText={(tripName) => this.setState({ tripName })} />
          </Item>
        }
        {this.displayField(TripEditFormEnum.DateRange) &&
          <Item regular inlineLabel style={styles.item}>
            <Label style={styles.itemLabel} >From date</Label>
            <DatePicker
              value={this.props.fromDate}
              onDateChange={(fromDate: Date) => this.setState({ fromDate: moment(fromDate) })}
            />
          </Item>
        }
        {this.displayField(TripEditFormEnum.DateRange) &&
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
    alignSelf: "stretch",
    // ...mixins.themes.debug1,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
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
