import React from "react";
import { View, Icon, Text, Button } from "native-base";
import { Image, StyleSheet, ViewStyle, TextStyle, TouchableHighlight, TouchableOpacity } from "react-native";
import NBColor from "../../theme/variables/commonColor.js";
import { IEntry, StyledCarousel } from "../../_atoms/Carousel/StyledCarousel";
import _ from "lodash";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import menuOptionStyles from "../../theme/variables/menuOptions.style.js";
import { StoreData } from "../../store/Interfaces";
import { tripApi  } from "../../screens/_services/apis";
import { getCancelToken } from "../../_function/commonFunc";
import moment from "moment";

export type ITripEntry = {
  tripId: string,
  title: string,
  subtitle: string,
  entries: IEntry[]
}

export interface Props {
  trip: StoreData.MinimizedTripVM,
  handleClick: (tripId: string) => void;
  handleShareClick: (tripId: string) => void;
  handleDeleteTrip: (tripId: string) => void;
  handleResetTripUpdatedId: () => void;
  updatedTripId: string
}

export interface State {
  tripEntry: ITripEntry
}

const EMPTY_TRIP_ENTRIES: IEntry[] = [
  {
    title: "NO LOCATION",
    subtitle: "Click to add location(s)",
    illustration: ""
  }
];

const EMPTY_LOCATION_ENTRY: IEntry = {
  title: "NO IMAGE",
  subtitle: "Click to add image(s)",
  illustration: ""
}

export default class TripCarousel extends React.Component<Props, State> {

  _cancelRequest;
  _cancelToken;

  constructor(props) {
    super(props);

    this.state = {
      tripEntry: this.normalizeTripEntry(this.props.trip)
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState) {
    return !nextProps.updatedTripId || this.props.trip.tripId === nextProps.updatedTripId;
  }

  componentDidUpdate() {
    if (this.props.updatedTripId) {
      var tmp = this;
      tripApi
          .get(`/trips/minimized/${this.props.trip.tripId}`, {
            cancelToken: this._cancelToken
          })
          .then(res => {
            if (res.data) {
                let tripEntry = tmp.normalizeTripEntry(res.data);
                this.setState({
                  tripEntry: tripEntry
                });
                this.props.handleResetTripUpdatedId();
              }            
          })
          .catch(error => {
              console.log("error: " + JSON.stringify(error));
          });
    }    
  }

  componentDidMount() {
    let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
    this._cancelToken = cancelToken;
    this._cancelRequest = cancelRequest;
  }
  
  componentWillUnmount() {
    this._cancelRequest('Operation canceled by the user.');
}

  normalizeTripEntry(trip: StoreData.MinimizedTripVM) {
    let entries: IEntry[] = trip.locationImages.map((locImg, locImgIdx) => ({
      title: locImg.name,
      subtitle: locImg.description,
      illustration: locImg.imageUrl,
    }));
    
    let tripEntry: ITripEntry = {
        tripId: trip.tripId,
        title: trip.name,
        subtitle: `${moment(trip.fromDate).format("DD/MMM/YYYY")} - ${moment(trip.toDate).format("DD/MMM/YYYY")}`,
        entries
    }

    let newTripEntry: ITripEntry = tripEntry;

    if (!newTripEntry.entries
      || (newTripEntry.entries && newTripEntry.entries.length == 0)) {
      newTripEntry.entries = EMPTY_TRIP_ENTRIES;

      return newTripEntry;
    }

    if (newTripEntry.entries) {
      _.each(newTripEntry.entries, (entry, idx) => {
        if (entry.illustration == "") {
          newTripEntry.entries[idx].subtitle = EMPTY_LOCATION_ENTRY.subtitle;
        }
      })
    }

    return newTripEntry;
  }

  private _handleShareClick = () => {
    this.props.handleShareClick(this.props.trip.tripId);
  }

  private _handleDeleteTrip = () => {
    this.props.handleDeleteTrip(this.props.trip.tripId);
  }

  render() {
    let { tripEntry } = this.state;
    const { title, subtitle } = tripEntry;
    const isTinder = false;

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeftContainer}>

            <Text style={[styles.title, isTinder ? {} : styles.titleDark]}>{title}</Text>
            <Text style={[styles.subtitle, isTinder ? {} : styles.titleDark]}>{subtitle}</Text>
          </View>
          <View style={styles.headerRightContainer}>
            <Button transparent primary small
                onPress={this._handleShareClick}>
                <Icon type="Ionicons" name="md-share-alt" />
            </Button>
            <Menu>
              <MenuTrigger>
                <Icon type="Ionicons" name="md-more" style={styles.moreMenu} />
              </MenuTrigger>
              <MenuOptions customStyles={
                  {
                    optionsContainer: menuOptionStyles.optionsContainer,
                    optionWrapper: menuOptionStyles.optionWrapper,
                    optionText: menuOptionStyles.optionText,
                  }
                }>
                <MenuOption onSelect={this._handleDeleteTrip} >
                  <Text style={styles.deleteLabel}>Delete Trip</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>
        <StyledCarousel
          title={tripEntry.title}
          subtitle={tripEntry.subtitle}
          entries={tripEntry.entries}
          clickHandler={() => this.props.handleClick(tripEntry.tripId)}
        />
      </View>
    );
  }
}

interface Style {
  container: ViewStyle;
  headerContainer: ViewStyle;
  headerLeftContainer: ViewStyle;
  headerRightContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  titleDark: TextStyle;
  moreMenu: TextStyle;
  deleteLabel: TextStyle;  
}

export const colors = {
  black: '#1a1917',
  gray: '#888888',
  background1: '#B721FF',
  background2: '#21D4FD'
};

const styles = StyleSheet.create<Style>({
  container: {
    // ...mixins.themes.debug1,
    paddingVertical: 10,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeftContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
  headerRightContainer: {
    display: "flex",
    flexDirection: "row",
  },
  title: {
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  titleDark: {
    color: colors.black
  },
  subtitle: {
    marginTop: 2,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  moreMenu: {
    marginRight: 30,
    marginTop: 2,
    marginLeft: 10,
    color: "#cccccc"
  },
  deleteLabel: {
    color: NBColor.brandDanger,
    padding: 10
  }
})