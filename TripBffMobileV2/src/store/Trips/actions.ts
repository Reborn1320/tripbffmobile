import { StoreData } from "../Interfaces";

export const TRIPS_ADD = "TRIPS_ADD"
export const TRIPS_PUBLIC_ADD = "TRIPS_PUBLIC_ADD"
export const TRIPS_DELETE = "TRIPS_DELETE"
export const TRIPS_GET_CURRENT_MINIMIZED = "TRIPS_GET_CURRENT_MINIMIZED"
export const TRIPS_PUBLIC_CLEAR = "TRIPS_PUBLIC_CLEAR"

export type TripsActions = AddTripsAction | ClearTripsAction
;

type AddTripsAction = {
    type: "TRIPS_PUBLIC_ADD",
    trips: Array<StoreData.MinimizedTripVM>,
}

type ClearTripsAction = {
    type: "TRIPS_PUBLIC_CLEAR",
}

export function addTrips(trips: Array<StoreData.TripVM>) {
    return {
        type: TRIPS_ADD, trips
    }
}

export function addPublicTrips(trips: Array<StoreData.MinimizedTripVM>) {
    return {
        type: TRIPS_PUBLIC_ADD, trips
    }
}

export function deleteTrip(tripId: string) {
    return {
        type: TRIPS_DELETE, tripId
    }
}

export function getCurrentMinimizedTrip(trip: StoreData.MinimizedTripVM) {
    return {
        type: TRIPS_GET_CURRENT_MINIMIZED, trip
    }
}

export function clearPublicTrips() {
    return {
        type: TRIPS_PUBLIC_CLEAR
    }
}