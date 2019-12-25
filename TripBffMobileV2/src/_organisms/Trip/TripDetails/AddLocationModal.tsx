//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text } from "native-base";
import { StyleSheet, ViewStyle, TextStyle, TouchableOpacity, Image, ImageStyle, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import { connectStyle } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment";
import SearchLocation from '../../../_molecules/Trip/SearchLocationComponent';
import { mixins } from "../../../_utils";
import 'moment/locale/vi';
import ActionModal from "../../../_molecules/ActionModal";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";
import MapboxGL from '@react-native-mapbox-gl/maps';
MapboxGL.setAccessToken('pk.eyJ1IjoidHJpcGJmZiIsImEiOiJjanFtZHA3b2cxNXhmNDJvMm5tNHR4bTFpIn0.QKKFlCG0G5sEHIss1n-A8g');


export interface Props extends PropsBase {
  isVisible: boolean;
  date: moment.Moment;
  confirmHandler: (name, address, long, lat, fromTime) => void;
  cancelHandler?: () => void
}

interface State {
  query: string;
  address: string,
  long: number,
  lat: number,
  places: Array<string>,
  isDateTimePickerVisible: boolean,
  displayTime: string,
  selectedTime: moment.Moment,
  isLoading: boolean
}

class AddLocationModalComponent extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      places: [],
      query: '',
      address: '',
      long: 0,
      lat: 0,
      isDateTimePickerVisible: false,
      displayTime: this.props.t("common:time_format", { date: moment() }),
      selectedTime: null,
      isLoading: true
    };    
  }

  _onCancel = () => {
    if (this.props.cancelHandler) {
      this.props.cancelHandler();
    }
  };

  _onConfirm = () => {
    if (this.state.query) {
      var selectedTime = this.state.selectedTime;

      if (selectedTime == null) {
        var startDate = this.props.date.startOf('day');
        var addedHours = moment().hour();
        var addedMinutes = moment().minute();
        selectedTime = startDate.add(addedHours, 'h').add(addedMinutes, 'm');
      }

      this.props.confirmHandler(this.state.query, this.state.address, this.state.long, this.state.lat, selectedTime);
    }
    else if (this.props.cancelHandler) {
      this.props.cancelHandler();
    }
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    var startDate = this.props.date.startOf('day');
    var addedHours = moment(date).hour();
    var addedMinutes = moment(date).minute();

    var selectedTime = startDate.add(addedHours, 'h').add(addedMinutes, 'm');    

    this.setState({
        displayTime: this.props.t("common:time_format", { date: moment(date) }),
        selectedTime: moment(selectedTime, "x")
      });
    this._hideDateTimePicker();
  };

  private _onModalShow = () => {
    this.setState({
      isLoading: false
    })
  }

  private _onModalHide = () => {
    this.setState({
      places: [],
      query: '',
      isLoading: true
    });
  }

  _selectedLocationHandler = (name, address, long, lat) => {
    this.setState({ 
      query: name,
      address: address,
      long: long,
      lat: lat});
  }

  _deselectedLocationHandler = () => {
    this.setState({ 
      query: "",
      address: "",
      long: 0,
      lat: 0});
  }

  render() {
    const { isVisible, date, t } = this.props;
    let displayDate = date ? t("common:date_format", { date: moment(date) }) + " - " : "";

    var contentElement = (
      <View style={styles.container}>
       {
          this.state.isLoading && <ActivityIndicator size="small" color="#00ff00" />
        }
        {
          !this.state.isLoading && 
            <View style={styles.contentContainer}>
                  <View style={styles.timeContainer}>
                    <TouchableOpacity onPress={this._showDateTimePicker} style={styles.timeLabelContainer}>
                      <Image    
                        style={styles.clockIcon}                  
                        source={require('../../../../assets/ClockIcon.png')}
                      />
                      <Text style={styles.timeLabel}>{t("trip_detail:add_location_from_time_label")}:
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
                      <MapboxGL.MapView
                            style={{flex: 1}}
                          >
                            <MapboxGL.Camera
                                  styleURL={MapboxGL.StyleURL.Street}
                                  zoomLevel={15}
                                  centerCoordinate={[this.state.long, this.state.lat]}
                                >
                              </MapboxGL.Camera>
                          </MapboxGL.MapView>
                    <View style={styles.searchContainer}>
                        <SearchLocation 
                          deselectHandler={this._deselectedLocationHandler}
                          confirmHandler={this._selectedLocationHandler}>
                        </SearchLocation>
                    </View>
                </View>
          </View>
        }                
      </View>
    );

    return (
        <ActionModal
          title={displayDate + t("trip_detail:add_location_modal_title")}
          isVisible={isVisible}
          onModalHideHandler={this._onModalHide}
          onModalShowHandler={this._onModalShow}
          onCancelHandler={this._onCancel}
          onConfirmHandler={this._onConfirm}
          >
          {contentElement}
        </ActionModal>
    );
  }
}

interface Style { 
  container: ViewStyle; 
  contentContainer: ViewStyle;
  timeContainer: ViewStyle;
  searchContainer: ViewStyle;
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
  container: {
    marginTop: 16,
    flex: 1
  },
  contentContainer: {
    flex: 1
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
  searchContainer: {
    position: "absolute",
    top: "3%",
    left: "1%",
    right: "1%"
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
  
const AddLocationModal = 
  connectStyle<typeof AddLocationModalComponent>('NativeBase.Modal', styles)(AddLocationModalComponent);
export default withNamespaces(['common'])(AddLocationModal);
