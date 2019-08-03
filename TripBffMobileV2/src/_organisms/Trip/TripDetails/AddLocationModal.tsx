//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Button, H2, Icon } from "native-base";
import { StyleSheet, ViewStyle, TextStyle, TouchableOpacity, Image, ImageStyle } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import  Autocomplete  from "react-native-autocomplete-input";
// const mbxClient = require('@mapbox/mapbox-sdk');
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const baseClient = mbxClient({ accessToken: 'pk.eyJ1IjoidHJpcGJmZiIsImEiOiJjanFtZHA3b2cxNXhmNDJvMm5tNHR4bTFpIn0.QKKFlCG0G5sEHIss1n-A8g' });
// const geoCodingService = mbxGeocoding(baseClient);
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment";
import SearchLocation from '../../../_molecules/Trip/SearchLocationComponent';
import { getLabel } from "../../../../i18n";
import { mixins } from "../../../_utils";
import NBColor from "../../../theme/variables/material.js";
import { DATE_FORMAT } from "../../../screens/_services/SystemConstants";

export interface Props {
  isVisible: boolean;
  date: moment.Moment;
  confirmHandler: (name, address, long, lat, fromTime) => void;
  cancelHandler?: () => void;
}

interface State {
  query: string;
  address: string,
  long: number,
  lat: number,
  places: Array<string>,
  isDateTimePickerVisible: boolean,
  displayTime: string,
  selectedTime: moment.Moment
}

class AddLocationModalComponent extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      places: [],
      query: '',
      address: '',
      long: 0,
      lat: 0,
      isDateTimePickerVisible: false,
      displayTime: moment().format('hh:mm A'),
      selectedTime: null
    };    
  }

  _onCancel = () => {
    if (this.props.cancelHandler) {
      this.props.cancelHandler();
    }
  };

  _onConfirm = () => {
    var selectedTime = this.state.selectedTime;

    if (selectedTime == null) {
      var startDate = this.props.date.startOf('day');
      var addedHours = moment().hour();
      var addedMinutes = moment().minute();
      selectedTime = startDate.add(addedHours, 'h').add(addedMinutes, 'm');
    }

     this.props.confirmHandler(this.state.query, this.state.address, this.state.long, this.state.lat, selectedTime);
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    var startDate = this.props.date.startOf('day');
    var addedHours = moment(date).hour();
    var addedMinutes = moment(date).minute();

    var selectedTime = startDate.add(addedHours, 'h').add(addedMinutes, 'm');
    console.log('selected time: ' + selectedTime);

    this.setState({
        displayTime: moment(date).format('hh:mm A'),
        selectedTime: moment(selectedTime, "x")
      });
    this._hideDateTimePicker();
  };

  onModalHide() {
    this.setState({
      places: [],
      query: ''
    });
  }

  _selectedLocationHandler = (name, address, long, lat) => {
    this.setState({ 
      query: name,
      address: address,
      long: long,
      lat: lat})
  }

  render() {
    const { isVisible, date } = this.props;
    let displayDate = date ? date.format(DATE_FORMAT) + " - " : "";

    return (
        <RNModal style={styles.modal} 
            isVisible={isVisible} hideModalContentWhileAnimating 
            onModalHide={() => this.onModalHide()}>
            <View style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={this._onCancel} style={styles.cancelButtonContainer}>
                        <Icon name="md-close" type="Ionicons" style={styles.cancelButtonIcon}></Icon>
                    </TouchableOpacity>
                    <Text style={styles.title}
                        >{displayDate + getLabel("trip_detail.add_location_modal_title")}
                    </Text>
                    <TouchableOpacity onPress={this._onConfirm} style={styles.saveButtonContainer}>
                        <Icon name="md-checkmark" type="Ionicons" style={styles.saveButtonIcon}></Icon>
                    </TouchableOpacity>
                </View>
                <View style={styles.timeContainer}>
                  <TouchableOpacity onPress={this._showDateTimePicker} style={styles.timeLabelContainer}>
                    <Image    
                      style={styles.clockIcon}                  
                      source={require('../../../../assets/ClockIcon.png')}
                    />
                    <Text style={styles.timeLabel}>{getLabel("trip_detail.add_location_from_time_label")}:
                    </Text>
                    <Text style={styles.time}>
                       {this.state.displayTime}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePicker
                    mode="time"
                    is24Hour={false}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                  />
                </View>
                <View style={styles.placesContainer}>
                  <SearchLocation 
                    confirmHandler={this._selectedLocationHandler}>
                  </SearchLocation>
              </View>
            </View>
        </RNModal>
    );
  }
}

interface Style {
  modal: ViewStyle,
  buttons: ViewStyle;
  cancelButtonContainer: ViewStyle;
  cancelButtonIcon: TextStyle;
  title: TextStyle;
  saveButtonContainer: ViewStyle;
  saveButtonIcon: TextStyle;
  modalInnerContainer: ViewStyle;
  timeContainer: ViewStyle;
  timeLabelContainer: ViewStyle;
  timeLabel: TextStyle;
  time: TextStyle;
  clockIcon: ImageStyle;
  placesContainer: ViewStyle;
  searchPlacesLabel: TextStyle;
  inputContainerStyle: ViewStyle;
  listViewContainer: ViewStyle;
  listStyle: ViewStyle;
  placeNameText: TextStyle;
  addressText: TextStyle;
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
    justifyContent: "space-between",
    height: 56,
    marginBottom: 12
  },
  cancelButtonContainer: {
    marginTop: 15,
    marginLeft: 20
  },
  cancelButtonIcon: {
    fontSize: 26
  },
  title: {
    marginTop: 15,
    marginLeft: 20,
    color: NBColor.brandPrimary,
    fontSize: 18,
    fontStyle: "normal",
    fontFamily: mixins.themes.fontBold.fontFamily
  },
  saveButtonContainer:{
    marginTop: 15,
    marginRight: 20
  },
  saveButtonIcon: {
    fontSize: 26,
    color: NBColor.brandPrimary
  },
  modalInnerContainer: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  listViewContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderBottomWidth: 0.5,
    height: 50,
    borderColor: '#d6d7da'
  },
  placesContainer: {
    flex: 1,
    margin: 5
  },
  timeContainer: {
    margin: "3%"
  },
  timeLabelContainer: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  timeLabel: {
    marginLeft: 7,
    color: "#383838",
    ...mixins.themes.fontNormal
  },
  time: {
    marginLeft: 7,
    ...mixins.themes.fontBold,
    color: "#383838"
  },
  clockIcon: {
    marginTop: 3,
    marginLeft: 3
  },
  searchPlacesLabel: {
    marginBottom: 5
  },
  inputContainerStyle: {    
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#d6d7da',
  },
  listStyle: {
    margin: 0,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5
  },
  placeNameText: {
    fontSize: 16,
    paddingLeft: 2,
    paddingTop: 2,
    ...mixins.themes.fontBold,    
  },
  addressText: {
    fontSize: 14, 
  }
})
  
const AddLocationModal = connectStyle<typeof AddLocationModalComponent>('NativeBase.Modal', styles)(AddLocationModalComponent);
export default AddLocationModal;
