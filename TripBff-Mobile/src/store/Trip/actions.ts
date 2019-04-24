import { StoreData, RawJsonData } from "../Interfaces"
import moment, { Moment } from "moment";

export const LOCATION_REMOVE = "TRIP_LOCATION_REMOVE"
export const LOCATION_ADD = "TRIP_LOCATION_ADD"
export const LOCATION_UPDATE_FEELING = "TRIP_LOCATION_UPDATE_FEELING"
export const LOCATION_UPDATE_ACTIVITY = "TRIP_LOCATION_UPDATE_ACTIVITY"
export const TRIP_UPDATE_DATE_RANGE = "TRIP_UPDATE_DATE_RANGE"
export const TRIP_UPDATE_TRIP_NAME = "TRIP_UPDATE_TRIP_NAME"
export const LOCATION_UPDATE_ADDRESS = "TRIP_LOCATION_UPDATE_ADDRESS"
export const LOCATION_UPDATE_IMAGES = "TRIP_LOCATION_UPDATE_IMAGES"

export type TripActions = RemoveLocation
| UpdateTripDateRange
;

type RemoveLocation = {
    type: "TRIP_LOCATION_REMOVE",
    tripId: string
    dateIdx: number
    locationId: string
}

type UpdateTripDateRange = {
    type: "TRIP_UPDATE_DATE_RANGE",
    tripId: string
    fromDate: Moment
    toDate: Moment
    locations: StoreData.LocationVM[]
}

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


export function updateTripDateRange(tripId: string, fromDate: moment.Moment, toDate: moment.Moment, locations: StoreData.LocationVM[]) {
    return {
        type: TRIP_UPDATE_DATE_RANGE, tripId, fromDate, toDate, locations
    }
}

export function updateTripName(tripId: string, tripName: string) {
    return {
        type: TRIP_UPDATE_TRIP_NAME, tripId, tripName
    }
}

export type LocationActions = UpdateLocationFeeling
| UpdateLocationActivity
| UpdateLocationAddress
| UpdateLocationImages
;

type UpdateLocationFeeling = {
    type: "TRIP_LOCATION_UPDATE_FEELING",
    dateIdx: number,
    locationId: string,
    feeling: StoreData.FeelingVM,
}

type UpdateLocationActivity = {
    type: "TRIP_LOCATION_UPDATE_ACTIVITY",
    dateIdx: number,
    locationId: string,
    activity: StoreData.ActivityVM,
}

type UpdateLocationAddress = {
    type: "TRIP_LOCATION_UPDATE_ADDRESS",
    dateIdx: number,
    locationId: string,
    location: RawJsonData.LocationAddressVM
}


type UpdateLocationImages = {
    type: "TRIP_LOCATION_UPDATE_IMAGES",
    dateIdx: number,
    locationId: string,
    locationImages: StoreData.ImportImageVM[]
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
 
export function updateLocationAddress(tripId: string, dateIdx: number, locationId: string, location: RawJsonData.LocationAddressVM) {
    return {
        type: LOCATION_UPDATE_ADDRESS, tripId, dateIdx, locationId, location
    }
}

export function updateLocationImages(tripId: string, locationId: string, locationImages: StoreData.ImportImageVM[]) {
    return {
        type: LOCATION_UPDATE_IMAGES, tripId, locationId, locationImages
    }
}