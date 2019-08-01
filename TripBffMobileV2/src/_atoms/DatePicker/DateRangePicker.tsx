import * as React from "react";
import { View, Text } from "native-base";
import { StyleSheet, ViewStyle } from "react-native";
import { connectStyle } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import moment, { Moment } from "moment";
import { getLabel } from "../../../i18n";
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import NBColor from "../../theme/variables/commonColor.js";
import DeviceInfo from 'react-native-device-info';
import 'moment/locale/vi';

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
  isValid: boolean;
}

class DateRangePickerModalComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);  
    this.state = {
        fromDate: this.props.fromDate,
        toDate: this.props.toDate,
        isValid: this.props.fromDate != null && this.props.toDate != null
    }
  }  

  private _onCancel = () => {
    this.props.cancelHandler();
  };

  private _onSave = () => {
    let { fromDate, toDate } = this.state;
    
    console.log("on date range save");
    console.log(fromDate.format(), toDate.format());

    this.props.confirmHandler(fromDate, toDate);
  }  

  private onDateChange = (date, type) => {
    if (type === 'END_DATE') {   
      this.setState({
        toDate: date,
        isValid: date != null && this.state.fromDate != null
      });
    } else {
      this.setState({
        fromDate: date,
        toDate: null,
        isValid: false
      });
    }
  }

  render() {
    const { isVisible } = this.props;
    let fromDate = this.state.fromDate;
    const toDate = this.state.toDate ? this.state.toDate.startOf("day") : null;
    let deviceLocale = DeviceInfo.getDeviceLocale();

    let mlist = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
    let weekdays = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    if(deviceLocale == "vi-VN") {
      mlist = [ "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12" ]
      weekdays = [ "T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    } 

    let backgroundColor = "#F0F0F0",
        isDisabled = true,
        textColor = "#A1A1A1";
    
    if (this.state.isValid) {
      backgroundColor = NBColor.brandMainColor,
      isDisabled = false;
      textColor = "#FFFFFF"
    }     

    return (
      <Modal
          isVisible={isVisible}
          style={styles.bottomModal}
          swipeDirection="down"
          onSwipeComplete={this._onCancel}
        >
          <View style={styles.content}>
              <View>
                <CalendarPicker
                    startFromMonday={true}
                    allowRangeSelection={true}
                    initialDate={fromDate} 
                    selectedStartDate={fromDate}
                    selectedEndDate={toDate} 
                    todayBackgroundColor="rgba(46, 151, 161, 0.5)"
                    selectedDayColor="#2E97A1"
                    selectedDayTextColor="#FFFFFF"
                    months={mlist}
                    weekdays={weekdays}
                    previousTitle={getLabel("create.prev_month_label")}
                    nextTitle={getLabel("create.next_month_label")}
                    onDateChange={this.onDateChange}                    
                />
              </View>                
              <View style={styles.buttons}>
                <Button
                    buttonStyle={{ backgroundColor: "transparent"}}
                    title={getLabel("action.cancel")}
                    titleStyle={{color: NBColor.brandMainColor, fontFamily: "Nunito", textTransform: "capitalize",
                          fontSize: 14, lineHeight: 16}}
                    onPress={this._onCancel}>
                </Button>
                <Button
                    buttonStyle={{backgroundColor: backgroundColor, 
                              borderRadius: 4,  width: 96, height: 32                  
                              }}
                    disabled={isDisabled}
                    title={getLabel("action.done")}
                    titleStyle={{color: textColor, fontFamily: "Nunito", textTransform: "capitalize",
                        fontSize: 14, lineHeight: 16}}
                    onPress={this._onSave}>         
                </Button>
            </View>
          </View>         
        </Modal>      
    );
  }
}

interface Style {
  buttons: ViewStyle;
  modalInnerContainer: ViewStyle;
  modalContentContainer: ViewStyle;
  bottomModal: ViewStyle;
  content: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  modalInnerContainer: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  modalContentContainer: {
    flex: 1
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
})
  
const DateRangePicker = 
    connectStyle<typeof DateRangePickerModalComponent>('NativeBase.Modal', styles)(DateRangePickerModalComponent);

export default DateRangePicker;
