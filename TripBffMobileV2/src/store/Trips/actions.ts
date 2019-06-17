import { StoreData } from "../Interfaces";

export const TRIPS_ADD = "TRIPS_ADD"
export const TRIPS_DELETE = "TRIPS_DELETE"
export const TRIPS_GET_CURRENT_MINIMIZED = "TRIPS_GET_CURRENT_MINIMIZED"

export function addTrips(trips: Array<StoreData.TripVM>) {
    return {
        type: TRIPS_ADD, trips
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