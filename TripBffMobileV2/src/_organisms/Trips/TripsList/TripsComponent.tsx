import React, { Component, PureComponent } from "react";
import { View } from "native-base";
import _ from "lodash";
import { StoreData } from "../../../store/Interfaces";
import  TripCarousel from "../../../_molecules/TripCarousel/TripCarousel";

export interface IStateProps {
}

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
  handleClick: (tripId: string) => void;
  trips: StoreData.MinimizedTripVM[];
  handleShareClick: (tripId: string) => void;
  handleDeleteTrip: (tripId:string) => void;
  handleResetTripUpdatedId: () => void;
  updatedTripId: string
}

interface State {
}

export class TripsComponent extends PureComponent<Props & IStateProps, State> {

   private _renderItem = itemInfo => {
    const trip: StoreData.MinimizedTripVM = itemInfo.item;

    return (
      <View key={itemInfo.index} >
        <TripCarousel
          trip={trip}
          updatedTripId={this.props.updatedTripId}
          handleClick={() => this.props.handleClick(trip.tripId)}
          handleShareClick={this.props.handleShareClick}
          handleDeleteTrip={this.props.handleDeleteTrip}
          handleResetTripUpdatedId={this.props.handleResetTripUpdatedId}
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
