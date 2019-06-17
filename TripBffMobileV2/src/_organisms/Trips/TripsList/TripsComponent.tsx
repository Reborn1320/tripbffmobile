import React, { Component, PureComponent } from "react";
import { View } from "native-base";
import _ from "lodash";
import { StoreData } from "../../../store/Interfaces";
import  TripCarousel from "../../../_molecules/TripCarousel/TripCarousel";
import { connect } from "react-redux";

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

export class TripsContentComponent extends PureComponent<Props & IStateProps, State> {

   private _renderItem = itemInfo => {
    const trip: StoreData.MinimizedTripVM = itemInfo.item;

    return (
      <View key={itemInfo.index} >
        <TripCarousel
          trip={trip}
          handleClick={this.props.handleClick}
          handleShareClick={this.props.handleShareClick}
          handleDeleteTrip={this.props.handleDeleteTrip}
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

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  return {
    trips: storeState.trips
  };
};

const TripsComponent = connect(
  mapStateToProps,
  null
)(TripsContentComponent);

export default TripsComponent;