import * as React from "react";
import { View, Text } from "native-base";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { connectStyle } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import moment, { Moment } from "moment";
import { getLabel } from "../../../i18n";
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import NBColor from "../../theme/variables/commonColor.js";
import DeviceInfo from 'react-native-device-info';
import { LIST_MONTHS_EN,
          LIST_MONTHS_VI,
          LIST_WEEKDAYS_EN,
          LIST_WEEKDAYS_VI,
          LOCALE_VI_VN,
          LOCALE_VI } from "../../screens/_services/SystemConstants";
import { mixins } from "../../_utils";

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

    let mlist = LIST_MONTHS_EN;
    let weekdays = LIST_WEEKDAYS_EN;

    if(deviceLocale &&
       (deviceLocale.toLowerCase() == LOCALE_VI_VN.toLowerCase() ||
        deviceLocale.toLowerCase() == LOCALE_VI.toLowerCase())) {
      mlist = LIST_MONTHS_VI;
      weekdays = LIST_WEEKDAYS_VI;
    } 

    let buttonDoneStyle = styles.buttonDoneDisabled,
        isDisabled = true,
        buttonDoneTitleStyle = styles.buttonDoneTitleDisabled;
    
    if (this.state.isValid) {
      buttonDoneStyle = styles.buttonDoneActived,
      isDisabled = false;
      buttonDoneTitleStyle = styles.buttonDoneTitleActived
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
                    selectedDayColor={NBColor.brandMainColor}
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
                    buttonStyle={styles.buttonCancel}
                    title={getLabel("action.cancel")}
                    titleStyle={[styles.buttonTitle, styles.buttonCancelTitle]}
                    onPress={this._onCancel}>
                </Button>
                <Button
                    buttonStyle={[styles.buttonDone, buttonDoneStyle]}
                    disabled={isDisabled}
                    title={getLabel("action.done")}
                    titleStyle={[styles.buttonTitle, buttonDoneTitleStyle]}
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
  buttonCancel: ViewStyle;
  buttonTitle: TextStyle;
  buttonCancelTitle: TextStyle;
  buttonDone: ViewStyle;
  buttonDoneDisabled: ViewStyle;
  buttonDoneActived: ViewStyle;
  buttonDoneTitleDisabled: TextStyle;
  buttonDoneTitleActived: TextStyle;
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
  buttonCancel: {
    backgroundColor: "transparent"
  },
  buttonTitle: {    
    fontFamily: mixins.themes.fontNormal.fontFamily,
    textTransform: "capitalize",
    fontSize: 14,
    lineHeight: 16
  },
  buttonCancelTitle: {
    color: NBColor.brandMainColor
  },
  buttonDone: {
    borderRadius: 4,
    width: 96,
    height: 32 
  },
  buttonDoneDisabled: {
    backgroundColor: "#F0F0F0"
  },
  buttonDoneActived: {
    backgroundColor: NBColor.brandMainColor
  },
  buttonDoneTitleDisabled: {
    color: "#A1A1A1"
  },
  buttonDoneTitleActived: {
    color: "#FFFFFF"
  }
})
  
const DateRangePicker = 
    connectStyle<typeof DateRangePickerModalComponent>('NativeBase.Modal', styles)(DateRangePickerModalComponent);

export default DateRangePicker;
