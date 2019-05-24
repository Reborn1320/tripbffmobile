import React, { Component } from "react";
import { View, H1, H3 } from "native-base";
import _ from "lodash";
import { StoreData } from "../../../store/Interfaces";
import { TouchableHighlight, StyleSheet, ViewStyle } from "react-native";
import { StyledCarousel, IEntry } from "../../../_atoms/Carousel/StyledCarousel";
import { TripCarousel } from "../../../_molecules/TripCarousel/TripCarousel";


export const ENTRIES2 = [
  {
    title: 'Favourites landscapes 1',
    subtitle: 'Lorem ipsum dolor sit amet',
    illustration: 'https://i.imgur.com/SsJmZ9jl.jpg'
  },
  {
    title: 'Favourites landscapes 2',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    illustration: 'https://i.imgur.com/5tj6S7Ol.jpg'
  },
  {
    title: 'Favourites landscapes 3',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat',
    illustration: 'https://i.imgur.com/pmSqIFZl.jpg'
  },
  {
    title: 'Favourites landscapes 4',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    illustration: 'https://i.imgur.com/cA8zoGel.jpg'
  },
  {
    title: 'Favourites landscapes 5',
    subtitle: 'Lorem ipsum dolor sit amet',
    illustration: 'https://i.imgur.com/pewusMzl.jpg'
  },
  {
    title: 'Favourites landscapes 6',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat',
    illustration: 'https://i.imgur.com/l49aYS3l.jpg'
  }
];

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
        illustration: locImg.imageUrl !== "" ? locImg.imageUrl : 'https://i.imgur.com/pmSqIFZl.jpg',
      }));
      if (entries.length == 0) {
        entries = ENTRIES2;
      }

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
