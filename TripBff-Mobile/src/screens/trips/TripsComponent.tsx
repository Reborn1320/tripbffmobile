import React, { Component } from "react";
import { Text, View, Button } from "native-base";
import _ from "lodash";
import { StoreData } from "../../Interfaces";

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
      <View key={itemInfo.index}>
        <Button full light onPress={() => this.props.handleClick(trip)}>
          <Text>{trip.name}: {trip.fromDate.format()} - {trip.toDate.format()}</Text>
        </Button>
      </View>
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