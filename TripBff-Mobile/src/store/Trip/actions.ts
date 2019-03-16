import { StoreData } from "../Interfaces"

export const LOCATION_REMOVE = "TRIP_LOCATION_REMOVE"
export const LOCATION_ADD = "TRIP_LOCATION_ADD"
export const LOCATION_UPDATE_FEELING = "TRIP_LOCATION_UPDATE_FEELING"
export const LOCATION_UPDATE = "TRIP_LOCATION_UPDATE"
export const LOCATION_UPDATE_ACTIVITY = "TRIP_LOCATION_UPDATE_ACTIVITY"

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

export function updateLocationFeeling(tripId: string, locationId: string, feeling: StoreData.FeelingVM) {
    return {
        type: LOCATION_UPDATE_FEELING, tripId, locationId, feeling
    }
}

export function updateLocations(tripId: string, locations: Array<StoreData.LocationVM>) {
    return {
        type: LOCATION_UPDATE, tripId, locations
    }
}

export function updateLocationActivity(tripId: string, locationId: string, activity: StoreData.ActivityVM) {
    return {
        type: LOCATION_UPDATE_ACTIVITY, tripId, locationId, activity
    }
}

 