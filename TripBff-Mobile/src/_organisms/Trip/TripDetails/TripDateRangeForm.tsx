import React, { Component } from "react";
import { Button, Text, View } from 'native-base';
import { Form, Item, Label, Input } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import { tripApi } from "../../../screens/_services/apis";
import moment, { Moment } from "moment";
import DatePicker from "../../../_atoms/DatePicker/DatePicker";
import { mixins } from "../../../_utils";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";

export interface Props {
  onClickEdit: (fromDate: Moment, toDate: Moment) => void;
  onCancel?: () => void;
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
      fromDate: props.fromDate.utc(false),
      toDate: props.toDate.utc(false),
    };
  }

  private formValid() {
    return this.state.fromDate && this.state.toDate;
  }

  private renderEditBtn() {
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
      <Form style={styles.formContainer}>
        <Item regular inlineLabel style={styles.item}>
          <Label style={styles.itemLabel} >From date</Label>
          <DatePicker
            value={this.props.fromDate}
            onDateChange={(fromDate: Date) => this.setState({ fromDate: moment(fromDate) })}
          />
        </Item>
        <Item regular inlineLabel style={styles.item}>
          <Label style={styles.itemLabel}>To date</Label>
          <DatePicker
            value={this.props.toDate}
            onDateChange={(toDate: Date) => this.setState({ toDate: moment(toDate) })}
          />
        </Item>
        <View style={styles.buttonsContainer}>
          {this.formValid() && this.renderEditBtn()}
          <Button transparent dark
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
}

const styles = StyleSheet.create<Style>({
  formContainer: {
    ...mixins.themes.debug1,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch"
  },
  item: {
    marginBottom: 10,
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
  }
})
