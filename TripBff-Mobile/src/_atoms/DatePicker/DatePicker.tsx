import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import { connectStyle, View, Label, DatePicker as DPicker } from 'native-base';
import { Moment } from "moment";

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
      <View>
        {labelText && <Label>{labelText}</Label>}
        <DPicker
          locale={"en"}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={"fade"}
          androidMode={"default"}
          placeHolderText="Select Date"
          textStyle={this.props.style.text}
          placeHolderTextStyle={this.props.style.placeHolderText}

          defaultDate={this.props.value.toDate()}
          onDateChange={this.props.onDateChange}
        />
      </View>
    );
  }
}

interface Style {
  text: TextStyle;
  placeHolderText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  text: {
    color: "orange"
  },
  placeHolderText: {
    color: "#a6a6a6"
  }
})

const DatePicker = connectStyle<typeof DatePickerComponent>('NativeBase.Modal', styles)(DatePickerComponent);
export default DatePicker;