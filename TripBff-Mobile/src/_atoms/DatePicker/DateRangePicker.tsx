import * as React from "react";
import { View, Text, Button } from "native-base";
import { StyleSheet, ViewStyle } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import { Moment } from "moment";
import { toDateUtc } from "../../_function/dateFuncs";

export interface Props {
  isVisible: boolean;
  fromDate: Moment;
  toDate: Moment;
  confirmHandler: (fromDate: Moment, toDate: Moment) => void;
  cancelHandler?: () => void;
}

interface State {
  fromDate: Moment;
  toDate: Moment;
}

class DateRangePickerModalComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);  
    this.state = {
        fromDate: this.props.fromDate,
        toDate: this.props.toDate
    }
  } 

  private _onCancel = () => {
    this.props.cancelHandler();
  };

  private _onSave = () => {
    let { fromDate, toDate } = this.state;
    const newFromDate = toDateUtc(fromDate);
    const newToDate = toDateUtc(toDate);
    console.log("on date range save");
    console.log(newFromDate.format(), newToDate.format());

    this.props.confirmHandler(newFromDate, newToDate);
  }  

  private onDateChange = (date, type) => {
    if (type === 'END_DATE') {      
      this.setState({
        toDate: date,
      });
    } else {
      this.setState({
        fromDate: date,
        toDate: null,
      });
    }
  }

  render() {
    const { isVisible } = this.props;
    const fromDate = this.state.fromDate;
    const toDate = this.state.toDate ? this.state.toDate.startOf("day") : null;

    // if (fromDate && toDate) {
    //   console.log("date range picker render");
    //   console.log(fromDate.format(), toDate.format());
    // }
          
    return (
        <RNModal style={styles.modal}            
            isVisible={isVisible} hideModalContentWhileAnimating>
            <View style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                    <Button transparent onPress={this._onCancel}><Text>Cancel</Text></Button>
                    <Button transparent onPress={this._onSave}><Text>Save</Text></Button>
                </View>
                <View style={styles.modalContentContainer}>
                    <CalendarPicker
                        startFromMonday={true}
                        allowRangeSelection={true} 
                        selectedStartDate={fromDate}
                        selectedEndDate={toDate} 
                        todayBackgroundColor="#f2e6ff"
                        selectedDayColor="#7300e6"
                        selectedDayTextColor="#FFFFFF"
                        onDateChange={this.onDateChange}
                    />
                </View>                
            </View>
        </RNModal>
    );
  }
}

interface Style {
  modal: ViewStyle,
  buttons: ViewStyle;
  modalInnerContainer: ViewStyle;
  modalContentContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalInnerContainer: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  modalContentContainer: {
    flex: 1
  }
})
  
const DateRangePicker = 
    connectStyle<typeof DateRangePickerModalComponent>('NativeBase.Modal', styles)(DateRangePickerModalComponent);

export default DateRangePicker;
