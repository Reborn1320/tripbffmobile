import React, { Component } from "react";
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import moment, { Moment } from "moment";
import * as RNa from "react-navigation";
import { TripDetails, DayVM } from "./TripDetails";
import { removeLocation, updateTripDateRange } from "../../../store/Trip/operations";
import { connect } from "react-redux";
import { fetchTripLocations } from "../../../store/Trips/operations";

interface IMapDispatchToProps {
    fetchLocations: (tripId: string) => Promise<Array<StoreData.LocationVM>>;
    removeLocation: (tripId: string, locationId: string) => Promise<void>;
    updateTripDateRange: (tripId: string, fromDate: Moment, toDate: Moment) => Promise<StoreData.TripVM>;
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

    fetchTrip() {
        this.props.fetchLocations(this.props.trip.tripId)
        .then((locations) => {
            var dayVMs: DayVM[] = [];

            const nDays = this.state.toDate.diff(this.state.fromDate, "days") + 1

            for (let idx = 0; idx < nDays; idx++) {
                dayVMs.push({
                    idx: idx + 1,
                    locations: locations
                        .filter(element => moment(element.fromTime).diff(this.state.fromDate, "days") == idx)
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

    private refreshTrip = () => {
        this.fetchTrip();
    }

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
            />
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
        updateTripDateRange: (tripId, fromDate, toDate) => dispatch(updateTripDateRange(tripId, fromDate, toDate)),
};
};

const TripDetailsContainer2 = connect(
    mapStateToProps,
    mapDispatchToProps
)(TripDetailsContainer);

export default TripDetailsContainer2;
