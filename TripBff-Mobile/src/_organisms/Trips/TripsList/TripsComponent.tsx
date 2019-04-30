import React, { Component } from "react";
import { View, H1, H3 } from "native-base";
import _ from "lodash";
import { StoreData } from "../../../store/Interfaces";
import { TouchableHighlight, StyleSheet, ViewStyle } from "react-native";

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

  private _renderItem = itemInfo => {
    const trip: StoreData.TripVM = itemInfo.item;
    return (
      <TouchableHighlight key={itemInfo.index} onPress={() => this.props.handleClick(trip)}>
        <View style={styles.itemContainer}>
          <H1>{trip.name}</H1>
          <H3>{trip.fromDate.format()} - {trip.toDate.format()}</H3>
          <H3>locations: {trip.locations.length}</H3>
        </View>
      </TouchableHighlight>
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
