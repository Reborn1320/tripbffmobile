import { StoreData } from "../Interfaces"

export const LOCATION_REMOVE = "TRIP_LOCATION_REMOVE"
export const LOCATION_ADD = "TRIP_LOCATION_ADD"

export function removeLocation(tripId: string, locationId: string) {
    return {
        type: LOCATION_REMOVE, tripId, locationId
    }
}

export function addLocation(tripId: string, location: StoreData.LocationVM) {
    return {
        type: LOCATION_ADD, tripId, location
    }
}