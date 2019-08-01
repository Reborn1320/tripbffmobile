import React, { PureComponent, Component } from "react";
import { Text, View, Form, Item, Label, Icon } from 'native-base';
import moment, { Moment } from "moment";
import DateRangePicker from "../../../_atoms/DatePicker/DateRangePicker";
import NBColor from "../../../theme/variables/commonColor.js";
import { getLabel } from "../../../../i18n";
import { Input, Button } from 'react-native-elements';
import { TouchableOpacity } from "react-native";

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
    let backgroundColor = "#F0F0F0",
        isDisabled = true,
        textColor = "#A1A1A1";
    
    if (this.state.tripName && this.state.fromDate && this.state.toDate ) {
      backgroundColor = NBColor.brandMainColor,
      isDisabled = false;
      textColor = "#FFFFFF"
    } 

    return (
      <Button
        buttonStyle={{backgroundColor: backgroundColor, 
                  borderRadius: 6,  width: 160, height: 48                  
                   }}
        disabled={isDisabled}
        title={getLabel(this.props.titleButton)}
        titleStyle={{color: textColor, fontFamily: "Nunito", textTransform: "capitalize",
            fontSize: 17, fontWeight: "600", lineHeight: 22}}
        onPress={this._onClickCreateTrip}>         
      </Button>
    );
  }

  render() {
    var date = this.state.fromDate.format('DD/MM/YYYY') + " - " + this.state.toDate.format('DD/MM/YYYY');

    return (
      <View>
          <View style={{marginTop: 24, marginLeft: "3.33%", marginRight: "3.33%"}}>            
            <Input
              label={getLabel("create.trip_name")}  
              labelStyle={{color: "#383838", fontFamily: "Nunito", fontSize: 14, fontWeight: "600", lineHeight: 20}}            
              leftIcon={{ type: 'font-awesome', name: 'globe', size: 20 }}
              value={this.state.tripName}
              onChangeText={(tripName) => this.setState({ tripName })} 
              inputStyle={{fontFamily: "Nunito", fontSize: 14, fontWeight: "600", color: "#383838", paddingLeft: 16 }}
            />
            <TouchableOpacity onPress={this._openDateRangePickerModal} activeOpacity={1} style={{marginTop: 24}}>
              <Input
                label={getLabel("create.date")}  
                labelStyle={{color: "#383838", fontFamily: "Nunito", fontSize: 14, fontWeight: "600", lineHeight: 20}}              
                leftIcon={{ type: 'font-awesome', name: 'calendar', size: 20 }}
                value={date}  
                editable={false}
                inputStyle={{fontFamily: "Nunito", fontSize: 14, fontWeight: "600", color: "#2E97A1", paddingLeft: 16 }}           
              />    
            </TouchableOpacity>    
          </View> 

          <View style={{
            marginTop: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
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