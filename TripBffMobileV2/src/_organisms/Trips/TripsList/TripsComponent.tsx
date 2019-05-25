import React, { Component } from "react";
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
}

interface State {
  tripEntries: ITripEntry[]
}

type ITripEntry = {
  tripId: string,
  title: string,
  subtitle: string,
  entries: IEntry[]
}

export class TripsComponent extends Component<Props & IStateProps, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tripEntries: []
    }
  }

  componentWillReceiveProps(nextProps: Props) {

    let tripEntries: ITripEntry[] = [];
    const { trips } = nextProps;

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

    this.setState({
      tripEntries
    });
  }

  private _renderItem = itemInfo => {
    const tripEntry: ITripEntry = itemInfo.item;

    return (
      <View key={itemInfo.index} >
        <TripCarousel
          tripEntry={tripEntry}
          handleClick={() => this.props.handleClick(tripEntry.tripId)}
          handleShareClick={this.props.handleShareClick}
        />
      </View>
    );
  };

  render() {
    const { tripEntries } = this.state;
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
