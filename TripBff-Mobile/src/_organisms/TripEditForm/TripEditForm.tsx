import React, { Component } from "react";
import { Button, Text, View } from 'native-base';
import { Form, Item, Label, Input } from 'native-base';
import moment, { Moment } from "moment";
import DatePicker from "../../_atoms/DatePicker/DatePicker";
import { mixins } from "../../_utils";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import { StoreData } from "../../store/Interfaces";

export interface Props {
  onClickEdit: (name: string, fromDate: Moment, toDate: Moment) => void;
  onCancel?: () => void;
  tripId: string,
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

class TripEditFormComponent extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      tripName: props.tripName,
      fromDate: props.fromDate ? props.fromDate.startOf('day') : null,
      toDate: props.toDate ? props.toDate.startOf('day') : null,
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

  _confirmEdit = () => {
    this.props.onClickEdit(this.state.tripName, this.state.fromDate.startOf('day'), this.state.toDate.endOf('day'));
  }

  private renderEditBtn() {
    return (
      <Button
        style={{ alignSelf: 'center' }}
        onPress={this._confirmEdit}>
        <Text>Edit</Text>
      </Button>
    );
  }

  render() {

    const { tripName, fromDate, toDate } = this.state;
    return (
      <Form style={styles.formContainer}>
        {this.displayField(TripEditFormEnum.Name) &&
          <Item regular inlineLabel style={styles.item}>
            <Label>Trip name</Label>
            <Input
              value={tripName}
              onChangeText={(newName) => this.setState({ tripName: newName })} />
          </Item>
        }
        {this.displayField(TripEditFormEnum.DateRange) &&
          <Item regular inlineLabel style={styles.item}>
            <Label style={styles.itemLabel} >From date</Label>
            <DatePicker
              value={fromDate}
              onDateChange={(newDate: Date) => this.setState({ fromDate: moment(newDate) })}
            />
          </Item>
        }
        {this.displayField(TripEditFormEnum.DateRange) &&
          <Item regular inlineLabel style={styles.item}>
            <Label style={styles.itemLabel}>To date</Label>
            <DatePicker
              value={toDate}
              onDateChange={(newDate: Date) =>  this.setState({ toDate: moment(newDate) })}
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


const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
  var tripId  = ownProps.tripId;
  var trip = _.find(storeState.trips, (item) => item.tripId == tripId);

  return {
      tripName: trip.name,
      fromDate: trip.fromDate,
      toDate: trip.toDate
  };
};

const TripEditForm = connect(
  mapStateToProps,
  null
)(TripEditFormComponent);

export default TripEditForm;