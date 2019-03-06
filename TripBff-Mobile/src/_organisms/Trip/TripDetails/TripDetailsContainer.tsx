import React, { Component } from "react";
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import moment from "moment";
import * as RNa from "react-navigation";
import { TripDetails, DayVM } from "./TripDetails";
import { removeLocation, addLocation } from "../../../store/Trip/operations";
import { connect } from "react-redux";
import { fetchTripLocations } from "../../../store/Trips/operations";

interface IMapDispatchToProps {
    fetchLocations: (tripId: string) => Promise<Array<StoreData.LocationVM>>;
    removeLocation: (tripId: string, locationId: string) => Promise<void>;
    addLocation: (tripId: string, location: StoreData.LocationVM) => Promise<void>;
}

export interface Props {
    trip: StoreData.TripVM,
    //todo remove navigation, and replace with handler
    navigation: RNa.NavigationScreenProp<any, any>;
}

interface State {
    tripId: string
    fromDate: moment.Moment
    toDate: moment.Moment
    name: string
    days: DayVM[],
    isLoaded: boolean,
    focusingLocationId?: string,
}

export class TripDetailsContainer extends Component<Props & IMapDispatchToProps, State> {

    constructor(props: Props & IMapDispatchToProps) {
        super(props)

        var dayVMs: DayVM[] = []

        this.state = {
            tripId: props.trip.tripId,
            fromDate: props.trip.fromDate,
            toDate: props.trip.toDate,
            name: props.trip.name,
            days: dayVMs,
            isLoaded: false,
        }
    }

    async componentDidMount() {
        this.fetchTrip();
    }

    compareLocationsFromTime(first, second) {
        if (first.fromTime < second.fromTime) 
            return -1
        else if (first.fromTime > second.fromTime)
            return 1
        else
            return 0;
    }

    fetchTrip() {
        this.props.fetchLocations(this.props.trip.tripId)
        .then((locations) => {
            var dayVMs: DayVM[] = [];

            const nDays = this.state.toDate.diff(this.state.fromDate, "days") + 1

            for (let idx = 0; idx < nDays; idx++) {
                dayVMs.push({
                    idx: idx + 1,
                    date: this.state.fromDate.add(idx, 'days'),
                    locations: locations
                        .filter(element => moment(element.fromTime).diff(this.state.fromDate, "days") == idx)
                        .sort(this.compareLocationsFromTime)
                        .map(e => {
                            return {
                                id: e.locationId,
                                address: e.location.address,
                                images: e.images.map(img => { return { url: img.url, highlight: false } })
                            }
                        })

                })
            }

            //console.log('dayVMs: ' + JSON.stringify(dayVMs));    
            this.setState({ days: dayVMs, isLoaded: true });

        });
    }

    _removeLocationConfirmed = async (tripId, locationId) => {
        this.props.removeLocation(tripId, locationId)
            .then(() => {
                this.fetchTrip();
            });
    }

    _addLocationConfirmed = async (address, fromTime)  => {
        console.log('address: ' + address);
        console.log('fromTime: ' + fromTime);
        console.log('tripId: ' + this.state.tripId);   

        var location: StoreData.LocationVM = {
            locationId: '',
            fromTime: fromTime,
            toTime: fromTime,
            location: {
                address: address,
                long: 0,
                lat: 0
            },
            images: []
        };
        this.props.addLocation(this.state.tripId, location)
        .then(() => {
            this.fetchTrip();
        });        
    }

    render() {
        const { tripId, name, days, isLoaded } = this.state;
        return (
            <TripDetails 
            isLoaded={isLoaded}
            tripId={tripId} tripName={name} days={days} navigation={this.props.navigation} 
            removeLocation={this._removeLocationConfirmed} 
            addLocation={this._addLocationConfirmed}/>
        );
    }
}

const mapStateToProps = (storeState, ownProps: Props) => {
    return {
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
    return {
        fetchLocations: (tripId) => dispatch(fetchTripLocations(tripId)),
        removeLocation: (tripId, locationId) => dispatch(removeLocation(tripId, locationId)),
        addLocation: (tripId, location) => dispatch(addLocation(tripId, location))
    };
};

const TripDetailsContainer2 = connect(
    mapStateToProps,
    mapDispatchToProps
)(TripDetailsContainer);

export default TripDetailsContainer2;
