import React, { Component, PureComponent } from "react";
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
  onClickEdit: (name: string) => void;
  onCancel?: () => void;
  tripName?: string;
  fromDate?: Moment;
  toDate?: Moment;

  fields: Array<TripEditFormEnum>;
}

interface State {
  tripName: string;
}

export enum TripEditFormEnum {
  Name,
  DateRange,
}

class TripEditForm extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      tripName: props.tripName  
    };
  }

  private displayField(fieldEnum: TripEditFormEnum) {
    return _.indexOf(this.props.fields, fieldEnum) !== -1;
  }

  private formValid() {
    if (this.props.fields.indexOf(TripEditFormEnum.Name) != -1 && !this.state.tripName) return false;
    return true;
  }

  _confirmEdit = () => {
    this.props.onClickEdit(this.state.tripName);
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

    const { tripName } = this.state;
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
        <View style={styles.buttonsContainer}>
          <Button transparent light
            style={{ alignSelf: 'center' }}
            onPress={() => { if (this.props.onCancel) this.props.onCancel() }}>
            <Text>Cancel</Text>
          </Button>
          {this.formValid() && this.renderEditBtn()}
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


export default TripEditForm;