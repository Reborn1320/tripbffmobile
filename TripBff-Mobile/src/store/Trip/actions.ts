import { StoreData, RawJsonData } from "../Interfaces"
import moment from "moment";

export const LOCATION_REMOVE = "TRIP_LOCATION_REMOVE"
export const LOCATION_ADD = "TRIP_LOCATION_ADD"
export const LOCATION_UPDATE_FEELING = "TRIP_LOCATION_UPDATE_FEELING"
export const LOCATION_UPDATE_ACTIVITY = "TRIP_LOCATION_UPDATE_ACTIVITY"
export const TRIP_UPDATE_DATE_RANGE = "TRIP_UPDATE_DATE_RANGE"
export const TRIP_UPDATE_TRIP_NAME = "TRIP_UPDATE_TRIP_NAME"
export const LOCATION_UPDATE_ADDRESS = "TRIP_LOCATION_UPDATE_ADDRESS"
export const LOCATION_UPDATE_HIGHLIGHT = "TRIP_LOCATION_UPDATE_HIGHLIGHT"

export function removeLocation(tripId: string, dateIdx: number, locationId: string) {
    return {
        type: LOCATION_REMOVE, tripId, dateIdx, locationId
    }
}

export function addLocation(tripId: string, dateIdx: number, location: StoreData.LocationVM) {
    return {
        type: LOCATION_ADD, tripId, dateIdx, location
    }
}

export function updateLocationFeeling(tripId: string, dateIdx: number, locationId: string, feeling: StoreData.FeelingVM) {
    return {
        type: LOCATION_UPDATE_FEELING, tripId, dateIdx, locationId, feeling
    }
}

export function updateLocationActivity(tripId: string, dateIdx: number, locationId: string, activity: StoreData.ActivityVM) {
    return {
        type: LOCATION_UPDATE_ACTIVITY, tripId, dateIdx, locationId, activity
    }
}

export function updateTripDateRange(tripId: string, fromDate: moment.Moment, toDate: moment.Moment) {
    return {
        type: TRIP_UPDATE_DATE_RANGE, tripId, fromDate, toDate
    }
}

export function updateTripName(tripId: string, tripName: string) {
    return {
        type: TRIP_UPDATE_TRIP_NAME, tripId, tripName
    }
}
 
export function updateLocationAddress(tripId: string, dateIdx: number, locationId: string, location: RawJsonData.LocationAddressVM) {
    return {
        type: LOCATION_UPDATE_ADDRESS, tripId, dateIdx, locationId, location
    }
}

export function updateLocationHighlight(tripId: string, dateIdx: number, locationId: string, highlights: Array<StoreData.LocationLikeItemVM>) {
    return {
        type: LOCATION_UPDATE_HIGHLIGHT, tripId, dateIdx, locationId, highlights
    }
}