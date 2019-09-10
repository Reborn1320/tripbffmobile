import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import { connectStyle, View, Label, DatePicker as DPicker } from 'native-base';
import moment, { Moment } from "moment";
import { mixins } from "../../_utils";

interface Props {
  style?: Style;

  value?: Moment;
  onDateChange: (value) => void;
  labelText?: string;
}

interface State {
  // value: Date;
}

class DatePickerComponent extends React.Component<Props, State> {

  // handleDateChange = (value: Date) => this.setState({ value })

  render() {
    var { labelText } = this.props;

    return (
      <DPicker
        locale={"en"}
        timeZoneOffsetInMinutes={undefined}
        modalTransparent={false}
        animationType={"fade"}
        androidMode={"default"}
        placeHolderText={this.props.value ? this.props.value.format("DD-MMM-YYYY") : "Select date"}
        textStyle={this.props.style.text}
        placeHolderTextStyle={this.props.style.placeHolderText}

        formatChosenDate={value => moment(value).format("DD-MMM-YYYY")}
        defaultDate={this.props.value.toDate()}
        onDateChange={this.props.onDateChange}
      />
    );
  }
}

interface Style {
  text: TextStyle;
  placeHolderText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  text: {
    // color: "orange"
  },
  placeHolderText: {
    color: "#a6a6a6",
    minWidth: 150,
    // ...mixins.themes.debug

  }
})

const DatePicker = connectStyle<typeof DatePickerComponent>('NativeBase.Modal', styles)(DatePickerComponent);
export default DatePicker;