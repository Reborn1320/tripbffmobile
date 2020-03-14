import React from "react";
import { View, Icon, Text, Button } from "native-base";
import { Image, StyleSheet, ViewStyle, TextStyle, Platform, TouchableOpacity } from "react-native";
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
import moment from "moment";
import { connect } from "react-redux";
import { mixins } from "../../_utils";
import { withNamespaces } from "react-i18next";
import { PropsBase } from "../../screens/_shared/LayoutContainer.js";
import 'moment/locale/vi';

export type ITripEntry = {
  tripId: string,
  title: string,
  subtitle: string,
  entries: IEntry[]
}

export interface Props extends PropsBase {
  trip: StoreData.MinimizedTripVM,
  handleClick: (tripId: string) => void;
  handleShareClick: (tripId: string) => void;
  handleDeleteTrip: (tripId: string) => void;
  currentMinimizedTrip?: StoreData.MinimizedTripVM
}

export interface State {
  tripEntry: ITripEntry,
  firstRender: boolean,
  updatedTripId: string
}

export class TripCarouselComponent extends React.Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
      firstRender: true,
      tripEntry: null,
      updatedTripId: null
    }
  }

  EMPTY_TRIP_ENTRIES: IEntry[] = [
    {
      title: "No Location",
      subtitle: this.props.t("message:add_location"),
      illustration: ""
    }
  ];
  
  EMPTY_LOCATION_ENTRY: IEntry = {
    title: "No Image",
    subtitle: this.props.t("message:add_image"),
    illustration: ""
  }

  shouldComponentUpdate(nextProps: Props, nextState) {
    return nextState.firstRender ||  
      (this.props.currentMinimizedTrip && this.props.trip.tripId === this.props.currentMinimizedTrip.tripId);
  }  

  private _normalizeTripEntry = (trip: StoreData.MinimizedTripVM) => {
    let entries: IEntry[] = trip.locationImages.map((locImg, locImgIdx) => ({
      title: locImg.name,
      subtitle: locImg.description,
      illustration: locImg.imageUrl ?? "",
    }));
    let tripEntry: ITripEntry = {
        tripId: trip.tripId,
        title: trip.name,
        subtitle: `${this.props.t("common:date_format", { date: moment(trip.fromDate) })} - ${this.props.t("common:date_format", { date: moment(trip.toDate) })}`,
        entries
    }

    let newTripEntry: ITripEntry = tripEntry;

    if (!newTripEntry.entries
      || (newTripEntry.entries && newTripEntry.entries.length == 0)) {
      newTripEntry.entries = this.EMPTY_TRIP_ENTRIES;

      return newTripEntry;
    }

    if (newTripEntry.entries) {
      _.each(newTripEntry.entries, (entry, idx) => {
        if (entry.illustration == "") {
          newTripEntry.entries[idx].subtitle = this.EMPTY_LOCATION_ENTRY.subtitle;
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

  private _handleClickTrip = () => {
    this.props.handleClick(this.props.trip.tripId);
  }

  render() {
    const { currentMinimizedTrip, trip, t } = this.props;
    let tripEntry = currentMinimizedTrip ? this._normalizeTripEntry(currentMinimizedTrip) :this._normalizeTripEntry(trip);
    const { title, subtitle } = tripEntry;
    let android9Style = Platform.OS === 'android' && Platform.Version === 28 ? styles.containerAndroid9 : {};

    return (      
      <View style={[styles.container, android9Style]}>
          <View style={{marginLeft: 12}}>
            <View style={styles.headerContainer}>              
                <View style={styles.titleContainer}>
                  <TouchableOpacity onPress={this._handleClickTrip}>
                    <Text numberOfLines={2} style={styles.title}>
                        {title}
                    </Text>  
                  </TouchableOpacity>
                </View>   
                <View style={{marginTop: 13, marginRight: 10}}>
                  <TouchableOpacity
                      onPress={this._handleShareClick}>
                      <Icon type="Ionicons" name="md-share-alt" style={{color:"#cccccc", fontSize: 24}}/>
                  </TouchableOpacity>                
                </View>
                <View style={{marginTop: 10}}>
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
                          <Text style={styles.deleteLabel}>{t("profile:delete_trip_menu")}</Text>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                </View>      
              </View>
              <View style={{marginTop: 4}}>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
          </View>         
          <View style={{marginVertical: 16}}>
            <StyledCarousel
              entries={tripEntry.entries}
              clickHandler={this._handleClickTrip}
            />
          </View>
      </View>
    );
  }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  return {
    currentMinimizedTrip: storeState.currentMinimizedTrip && storeState.currentMinimizedTrip.tripId == ownProps.trip.tripId
                           ? storeState.currentMinimizedTrip : ""
  };
};

const TripCarousel = connect(
  mapStateToProps,
  null
)(TripCarouselComponent);

export default withNamespaces(['profile', 'message'])(TripCarousel);

interface Style {
  container: ViewStyle;
  containerAndroid9: ViewStyle;
  headerContainer: ViewStyle;
  titleContainer: ViewStyle;  
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
    margin: 12,
    marginBottom: 20,
    shadowColor: "rgba(0, 0, 0, 0.07)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 0.7,
    borderRadius: 4
  },
  containerAndroid9: {
    backgroundColor: "#fff"
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    flexDirection: "row"
  }, 
  titleContainer: {
    width: "80%",
    marginTop: 16
  },
  title: {
    color: NBColor.brandPrimary,
    fontSize: 18,
    ...mixins.themes.fontBold,
    fontStyle: "normal",
    lineHeight: 20    
  },
  titleDark: {
    color: colors.black
  },
  subtitle: {
    fontStyle: 'normal',
    fontSize: 14,
    ...mixins.themes.fontNormal,
    lineHeight: 18,
  },
  moreMenu: {
    marginRight: 20,
    marginTop: 2,
    marginLeft: 10,
    color: "#cccccc"
  },
  deleteLabel: {
    padding: 10
  }
})