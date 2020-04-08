import React, { Component, PureComponent } from "react";
import { View } from "native-base";
import _ from "lodash";
import { StoreData } from "../../../store/Interfaces";
import  TripCarousel from "../../../_molecules/TripCarousel/TripCarousel";
import { connect } from "react-redux";
import { FlatList } from "react-native";

export interface IStateProps {
}

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
  handleClick: (tripId: string, canContribute: boolean, createdById: string) => void;
  trips: StoreData.MinimizedTripVM[];
  page: number;
  handleShareClick?: (tripId: string) => void;
  handleDeleteTrip?: (tripId:string) => void;
  loadMoreTrips?: (page: number) => void;
}

interface State {
  page: number
}

class TripsComponent extends PureComponent<Props & IStateProps, State> {

  constructor(props) {
    super(props);

    this.state = {
      page: this.props.page
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.page != this.props.page && this.props.page == 0) {
      this.setState({ page: 0 });
    }
  }

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

  _endReached = () => {
    let newPage = this.state.page + 1;
    this.setState({ page: newPage });
    this.props.loadMoreTrips(newPage);    
  }

  render() {
    const { trips } = this.props;    

    return (
      <View style={{flex: 1}}>
         { trips && 
         <FlatList   
          data={trips}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => String(index)}
          onEndReached={this._endReached}
          onEndReachedThreshold={0.01}
         /> }        
      </View>
    );
  }
}

export default TripsComponent;