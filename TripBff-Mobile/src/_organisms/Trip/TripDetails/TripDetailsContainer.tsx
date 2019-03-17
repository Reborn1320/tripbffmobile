import React, { Component } from "react";
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import moment, { Moment } from "moment";
import * as RNa from "react-navigation";
import { TripDetails, DayVM } from "./TripDetails";
import { removeLocation, updateTripDateRange, addLocation, updateLocationFeeling, updateLocationActivity } from "../../../store/Trip/operations";
import { connect } from "react-redux";
import { fetchTripLocations } from "../../../store/Trips/operations";
import { updateLocations } from "../../../store/Trip/actions";

interface IMapDispatchToProps {
    fetchLocations: (tripId: string) => Promise<Array<StoreData.LocationVM>>;
    removeLocation: (tripId: string, locationId: string) => Promise<void>;
    updateTripDateRange: (tripId: string, fromDate: Moment, toDate: Moment) => Promise<StoreData.TripVM>;
    addLocation: (tripId: string, location: StoreData.LocationVM) => Promise<void>;
    updateLocationFeeling: (tripId: string, locationId: string, feeling: StoreData.FeelingVM) => Promise<void>;
    updateLocations: (tripId: string, locations: Array<StoreData.LocationVM>) => Promise<void>; 
    updateLocationActivity: (tripId: string, locationId: string, activity: StoreData.ActivityVM) => Promise<void>;
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
        if (this.props.trip && this.props.trip.locations) {
            this._refreshTrip(this.props.trip.locations);
        }
        else {
            this.props.fetchLocations(this.props.trip.tripId)
            .then((locations) => {  
                //TODO LATER: should correct update locations method in reducers
                this.props.updateLocations(this.state.tripId, locations);           
                this._refreshTrip(locations);
            });
        }     
    }

    _refreshTrip(locations) {
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
                                    images: e.images.map(img => { return { url: img.url, highlight: false } }),
                                    feeling: e.feeling,
                                    activity: e.activity
                                }
                            })
    
                    })
                }
    
                //console.log('dayVMs: ' + JSON.stringify(dayVMs));    
                this.setState({ days: dayVMs, isLoaded: true });
    }

    _removeLocationConfirmed = async (tripId, locationId) => {
        this.props.removeLocation(tripId, locationId)
            .then(() => {
                this.fetchTrip();
            });
    }

    private refreshTrip = () => {
        this.fetchTrip();
    }

    _addLocationConfirmed = async (address, fromTime)  => {
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

    _updateLocationFeeling = async (locationId, feeling) => {
        this.props.updateLocationFeeling(this.state.tripId, locationId, feeling)
                  .then(() => {
                      //TODO: refresh focus location
                      this.fetchTrip();
                 });
    };

    _updateLocationActivity = async (locationId, activity) => {
        this.props.updateLocationActivity(this.state.tripId, locationId, activity)
                  .then(() => {
                      //TODO: refresh focus location
                      this.fetchTrip();
                 });
    };

    render() {
        const { tripId, name, days, isLoaded, fromDate, toDate } = this.state;
        return (
            <TripDetails 
            isLoaded={isLoaded}
            tripId={tripId} tripName={name} days={days} fromDate={fromDate} toDate={toDate}
            navigation={this.props.navigation}
            removeLocation={this._removeLocationConfirmed}
            updateTripDateRange={this.props.updateTripDateRange}
            onRefresh={this.refreshTrip}
            addLocation={this._addLocationConfirmed}
            updateLocationFeeling={this._updateLocationFeeling}
            updateLocationActivity={this._updateLocationActivity}
            />
        );
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    return {

        ...ownProps
    };
};

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
    return {
        fetchLocations: (tripId) => dispatch(fetchTripLocations(tripId)),
        removeLocation: (tripId, locationId) => dispatch(removeLocation(tripId, locationId)),
        updateTripDateRange: (tripId, fromDate, toDate) => dispatch(updateTripDateRange(tripId, fromDate, toDate)),
        addLocation: (tripId, location) => dispatch(addLocation(tripId, location)),
        updateLocationFeeling: (tripId, locationId, feeling) => dispatch(updateLocationFeeling(tripId, locationId, feeling)),
        updateLocations: (tripId, locations) => dispatch(updateLocations(tripId, locations)),
        updateLocationActivity: (tripId, locationId, activity) => dispatch(updateLocationActivity(tripId, locationId, activity)),
    };
};

const TripDetailsContainer2 = connect(
    mapStateToProps,
    mapDispatchToProps
)(TripDetailsContainer);

export default TripDetailsContainer2;
