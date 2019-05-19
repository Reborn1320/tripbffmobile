import React, { Component } from "react";
import { View, H1, H3 } from "native-base";
import _ from "lodash";
import { StoreData } from "../../../store/Interfaces";
import { TouchableHighlight, StyleSheet, ViewStyle } from "react-native";
import { StyledCarousel, IEntry } from "../../../_atoms/Carousel/StyledCarousel";


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
  handleClick: (trip: any) => void;
  trips: StoreData.MinimizedTripVM[]
}

interface State {
}

export class TripsComponent extends Component<Props & IStateProps, State> {
  constructor(props: Props) {
    super(props);

  }

  private _renderItem = itemInfo => {
    const trip: StoreData.MinimizedTripVM = itemInfo.item;
    
    let entries: IEntry[] = trip.locationImages.map((locImg, locImgIdx) => ({
      title: `image location ${locImgIdx}`,
      subtitle: `this is image description`,
      illustration: locImg !== "" ? locImg : 'https://i.imgur.com/pmSqIFZl.jpg',
    }));
    if (entries.length == 0) {
      entries = ENTRIES2;
    }

    return (
      <View key={itemInfo.index} >
        <StyledCarousel
          title={trip.name}
          subtitle={`${trip.fromDate.format("DD/MMM/YYYY")} - ${trip.toDate.format("DD/MMM/YYYY")}`}
          entries={entries}
          clickHandler={() => this.props.handleClick(trip)}
        />
      </View>
    );
  };

  render() {
    const { trips } = this.props;
    return (
      <View>
        {trips.map((trip, index) => this._renderItem({ item: trip, index }))}
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
