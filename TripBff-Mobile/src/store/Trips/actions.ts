import { StoreData } from "../Interfaces";

export const TRIPS_ADD = "TRIPS_ADD"

export function addTrips(trips: Array<StoreData.TripVM>) {
    return {
        type: TRIPS_ADD, trips
    }
}