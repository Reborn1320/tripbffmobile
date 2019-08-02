import React, { PureComponent, Component } from "react";
import { View } from 'native-base';
import moment, { Moment } from "moment";
import DateRangePicker from "../../../_atoms/DatePicker/DateRangePicker";
import NBColor from "../../../theme/variables/commonColor.js";
import { getLabel } from "../../../../i18n";
import { Input, Button } from 'react-native-elements';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { mixins } from "../../../_utils";
import { DATE_FORMAT } from "../../_services/SystemConstants";

export interface Props {
    createTrip?: (name: string, fromDate: Moment, toDate: Moment) => Promise<string>;
    onTripCreatedUpdatedHandler?: (tripId: string, name: string) => void;
    updateTrip: (tripId: string, name: string, fromDate: Moment, toDate: Moment) => Promise<any>;
    tripId?: string,
    tripName?: string,
    tripFromDate?: moment.Moment,
    tripToDate?: moment.Moment,
    titleButton: string
}

export class TripCreationForm extends PureComponent<Props, any> {

  constructor(props) {
    super(props);

    this.state = { 
      tripId: this.props.tripId,
      tripName: this.props.tripName,
      isOpenDateRangePickerModal: false,
      fromDate: this.props.tripFromDate ? this.props.tripFromDate : moment(),
      toDate: this.props.tripToDate ? this.props.tripToDate : moment()
    };
  }  

  private _onClickCreateTrip = () => {

    let tripId = this.state.tripId,
        tripName = this.state.tripName,
        fromDate = moment(this.state.fromDate).startOf('day'),
        toDate = moment(this.state.toDate).endOf('day');

    if (tripId) {
      this.props.updateTrip(tripId, tripName, fromDate, toDate)
      .then(() => {
        this.props.onTripCreatedUpdatedHandler(tripId, tripName);
      });       
    }
    else {
      this.props.createTrip(tripName, fromDate, toDate)
      .then(tripId => {
          this.setState({ tripId: tripId });
          this.props.onTripCreatedUpdatedHandler(tripId, tripName);
      });
    }    
  }  

  private _openDateRangePickerModal = () => {
    this.setState({
      isOpenDateRangePickerModal: true
    });
  }

  private _confirmHandler = (fromDate: Moment, toDate: Moment) => {
    this.setState({
      isOpenDateRangePickerModal: false,
      fromDate: fromDate,
      toDate: toDate
    });
  }

  private _cancelHandler = () => {
    this.setState({
      isOpenDateRangePickerModal: false
    });
  }

  renderImportBtn() {
    let buttonStyle = styles.buttonDisabled,
        isDisabled = true,
        buttonTitleStyle = styles.buttonTitleDisabled;
    
    if (this.state.tripName && this.state.fromDate && this.state.toDate ) {
      buttonStyle = styles.buttonActived,
      isDisabled = false;
      buttonTitleStyle = styles.buttonTitleActived
    } 

    return (
      <Button
        buttonStyle={[styles.button, buttonStyle]}
        disabled={isDisabled}
        title={getLabel(this.props.titleButton)}
        titleStyle={[styles.buttonTitle, buttonTitleStyle]}
        onPress={this._onClickCreateTrip}>         
      </Button>
    );
  }

  render() {
    var date = this.state.fromDate.format(DATE_FORMAT) + " - " + this.state.toDate.format(DATE_FORMAT);

    return (
      <View>
          <View style={styles.formContainer}>            
            <Input
              label={getLabel("create.trip_name")}  
              labelStyle={styles.formLabel}            
              leftIcon={{ type: 'font-awesome', name: 'globe', size: 20 }}
              value={this.state.tripName}
              onChangeText={(tripName) => this.setState({ tripName })} 
              inputStyle={[styles.formInput, styles.formInputTripName]}
              inputContainerStyle={styles.formInputContainer}
            />
            <TouchableOpacity onPress={this._openDateRangePickerModal} activeOpacity={1} style={{marginTop: 24}}>
              <Input
                label={getLabel("create.date")}  
                labelStyle={styles.formLabel}              
                leftIcon={{ type: 'font-awesome', name: 'calendar', size: 20 }}
                value={date}  
                editable={false}
                inputStyle={[styles.formInput, styles.formInputDateRange]}   
                inputContainerStyle={styles.formInputContainer}        
              />    
            </TouchableOpacity>    
          </View> 

          <View style={styles.buttonContainer}>
            {this.renderImportBtn()}
          </View>

          <DateRangePicker 
              isVisible={this.state.isOpenDateRangePickerModal}
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
              cancelHandler={this._cancelHandler}
              confirmHandler={this._confirmHandler}>            
          </DateRangePicker>   
      </View>      
    );
  }
}

interface Style {
  formContainer: ViewStyle;
  formLabel: TextStyle;
  formInput: TextStyle;
  formInputTripName: TextStyle;
  formInputDateRange: TextStyle;
  formInputContainer: ViewStyle;
  buttonContainer: ViewStyle;
  button: ViewStyle;
  buttonDisabled: ViewStyle;
  buttonActived: ViewStyle;
  buttonTitle: TextStyle;
  buttonTitleDisabled: TextStyle;
  buttonTitleActived: TextStyle;
}

const styles = StyleSheet.create<Style>({
  formContainer: {
    marginTop: 24,
    marginLeft: "3.33%",
    marginRight: "3.33%"
  },
  formLabel: {
    color: "#383838",
    fontFamily: mixins.themes.fontNormal.fontFamily,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20
  },
  formInput: {
    fontFamily: mixins.themes.fontNormal.fontFamily,
    fontSize: 14,
    fontWeight: "600",
    paddingLeft: 16
  },
  formInputTripName: {
    color: "#383838"
  },
  formInputDateRange: {
    color: NBColor.brandMainColor
  },
  formInputContainer: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#A1A1A1",
    borderRadius: 4,
    marginTop: 8
  },
  buttonContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    borderRadius: 6,
    width: 160,
     height: 48  
  },
  buttonDisabled: {
    backgroundColor: "#F0F0F0"
  },
  buttonActived: {
    backgroundColor: NBColor.brandMainColor
  },
  buttonTitle: {
    fontFamily: mixins.themes.fontNormal.fontFamily,
    textTransform: "capitalize",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22
  },
  buttonTitleDisabled: {
    color: "#A1A1A1"
  },
  buttonTitleActived: {
    color: "#FFFFFF"
  }
})
  