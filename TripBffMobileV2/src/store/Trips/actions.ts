import { StoreData } from "../Interfaces";

export const TRIPS_ADD = "TRIPS_ADD"
export const TRIPS_DELETE = "TRIPS_DELETE"

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