import React, { Component } from "react";
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import moment from "moment";
import { tripApi } from "../../_services/apis";
import * as RNa from "react-navigation";
import { TripDetails, DayVM } from "./TripDetails";
import { removeLocation } from "../../../store/Trip/operations";
import { connect } from "react-redux";

interface IMapDispatchToProps {
    removeLocation: (tripId: string, locationId: string) => Promise<void>
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

    //todo move to redux-thunk approach
    fetchTrip() {
        var url = '/trips/' + this.props.trip.tripId + '/locations';
        tripApi.get(url)
            .then((res) => {
                var trip = res.data;
                var dayVMs: DayVM[] = [];

                const nDays = this.state.toDate.diff(this.state.fromDate, "days") + 1

                for (let idx = 0; idx < nDays; idx++) {
                    dayVMs.push({
                        idx: idx + 1,
                        locations: trip.locations
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

            })
            .catch((err) => {
                console.log('error: ' + JSON.stringify(err));
            });
    }

    _removeLocationConfirmed = async (tripId, locationId) => {
        this.props.removeLocation(tripId, locationId)
            .then(() => {
                this.fetchTrip();
            });
    }

    render() {
        const { tripId, days } = this.state;
        return (
            <TripDetails tripId={tripId} days={days} navigation={this.props.navigation} removeLocation={this._removeLocationConfirmed} />
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
        removeLocation: (tripId, locationId) => dispatch(removeLocation(tripId, locationId)),
    };
};

const TripDetailsContainer2 = connect(
    mapStateToProps,
    mapDispatchToProps
)(TripDetailsContainer);

export default TripDetailsContainer2;
