import React, { Component, PureComponent } from "react";
import { View } from "native-base";
import _ from "lodash";
import { StoreData } from "../../../store/Interfaces";
import { StyleSheet, ViewStyle } from "react-native";
import { IEntry } from "../../../_atoms/Carousel/StyledCarousel";
import { TripCarousel } from "../../../_molecules/TripCarousel/TripCarousel";

export interface IStateProps {
}

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
  handleClick: (tripId: string) => void;
  trips: StoreData.MinimizedTripVM[];
  handleShareClick: (tripId: string) => void;
  handleDeleteTrip: (tripId:string) => void;
}

interface State {
}

type ITripEntry = {
  tripId: string,
  title: string,
  subtitle: string,
  entries: IEntry[]
}

export class TripsComponent extends PureComponent<Props & IStateProps, State> {

  shouldComponentUpdate(nextProps: Props, nextState) {
    return this.props.trips != nextProps.trips;
  }

   private _renderItem = itemInfo => {
    const tripEntry: ITripEntry = itemInfo.item;

    return (
      <View key={itemInfo.index} >
        <TripCarousel
          tripEntry={tripEntry}
          handleClick={() => this.props.handleClick(tripEntry.tripId)}
          handleShareClick={this.props.handleShareClick}
          handleDeleteTrip={this.props.handleDeleteTrip}
        />
      </View>
    );
  };

  render() {

    let tripEntries: ITripEntry[] = [];
    const { trips } = this.props;

    trips.forEach(trip => {

      let entries: IEntry[] = trip.locationImages.map((locImg, locImgIdx) => ({
        title: locImg.name,
        subtitle: locImg.description,
        illustration: locImg.imageUrl,
      }));

      tripEntries.push({
        tripId: trip.tripId,
        title: trip.name,
        subtitle: `${trip.fromDate.format("DD/MMM/YYYY")} - ${trip.toDate.format("DD/MMM/YYYY")}`,
        entries
      });

    });

    return (
      <View>
        {tripEntries.map((trip, index) => this._renderItem({ item: trip, index }))}
      </View>
    );
  }
}


interface Style {
  itemContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  itemContainer: {
    padding: 10,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1
  }
})
