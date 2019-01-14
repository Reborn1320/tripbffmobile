import React, { Component } from "react";
import { View, H1, H3 } from "native-base";
import _ from "lodash";
import { StoreData } from "../../Interfaces";
import { TouchableHighlight } from "react-native";

export interface IStateProps {
}

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
  handleClick: (trip: any) => void;
  trips: Array<StoreData.TripVM>
}

interface State {
}

export class TripsComponent extends Component<Props & IStateProps, State> {
  constructor(props: Props) {
    super(props);
  }

  _renderItem = itemInfo => {
    const trip: StoreData.TripVM = itemInfo.item;
    return (
      <TouchableHighlight key={itemInfo.index} onPress={() => this.props.handleClick(trip)}>
        <View style={{ height: 100, borderBottomColor: "orange", borderBottomWidth: 1 }}>
          <H1>{trip.name}</H1>
          <H3>{trip.fromDate.format("MMM Do YY")} - {trip.toDate.format("MMM Do YY")}</H3>
          <H3>locations: {trip.locations.length}</H3>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { trips } = this.props;
    return (
      <View>
        {trips.map((trip, index) => this._renderItem({item: trip, index }))}
      </View>
    );
  }
}