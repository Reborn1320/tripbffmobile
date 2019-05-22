import { StoreData, RawJsonData } from "../Interfaces"
import moment, { Moment } from "moment";

export const LOCATION_REMOVE = "TRIP_LOCATION_REMOVE"
export const LOCATION_ADD = "TRIP_LOCATION_ADD"
export const LOCATION_UPDATE_FEELING = "TRIP_LOCATION_UPDATE_FEELING"
export const LOCATION_UPDATE_ACTIVITY = "TRIP_LOCATION_UPDATE_ACTIVITY"
export const TRIP_UPDATE_DATE_RANGE = "TRIP_UPDATE_DATE_RANGE"
export const TRIP_UPDATE_TRIP_NAME = "TRIP_UPDATE_TRIP_NAME"
export const IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS = "TRIP/IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS"
export const ADD_INFOGRAPHIC_ID = "TRIP/ADD_INFOGRAPHIC_ID"
export const TRIP_UPDATE = "TRIP_UPDATE"

export const LOCATION_UPDATE_ADDRESS = "TRIP_LOCATION_UPDATE_ADDRESS"
export const LOCATION_UPDATE_IMAGES = "TRIP_LOCATION_UPDATE_IMAGES"
export const LOCATION_UPDATE_HIGHLIGHT = "TRIP_LOCATION_UPDATE_HIGHLIGHT"
export const LOCATION_UPDATE_DESCRIPTION = "TRIP_LOCATION_UPDATE_DESCRIPTION"

export const LOCATION_IMAGE_FAVOR = "TRIP_LOCATION_IMAGE_FAVOR"

export type TripActions = {
    type: "TRIP/...",
    tripId: string,
    dateIdx: number,
}
| AddTripAction
| ReplaceTripAction
| RemoveLocation
| UpdateTripDateRange
| UpdateTripName
| AddInfographicId
| ImportSelectedLocations
| UpdateBasicTrip
;


type AddTripAction = {
    type: "TRIP_ADD",
    trip: StoreData.TripVM,
}

type ReplaceTripAction = {
    type: "TRIP_REPLACE",
    trip: StoreData.TripVM,
}

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

type UpdateTripName = {
    type: "TRIP_UPDATE_TRIP_NAME",
    tripId: string,
    tripName: string
}

type ImportSelectedLocations = {
    type: "TRIP/IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS",
    tripId: string
    locations: IImportLocation[]
}


type AddInfographicId = {
    type: "TRIP/ADD_INFOGRAPHIC_ID",
    tripId: string,
    infographicId: string
}

type UpdateBasicTrip = {
    type: "TRIP_UPDATE",
    tripId: string,
    name: string,
    fromDate: Moment,
    toDate: Moment
}


export function createTrip(trip: StoreData.TripVM): AddTripAction {
    return {
        type: "TRIP_ADD", trip
    }
}

export function replaceTrip(trip: StoreData.TripVM): ReplaceTripAction {
    return {
        type: "TRIP_REPLACE", trip
    }
}

export function removeLocation(tripId: string, dateIdx: number, locationId: string): RemoveLocation {
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

export function updateTrip(tripId: string, name: string, fromDate: moment.Moment, toDate: moment.Moment) : UpdateBasicTrip {
    return {
        type: TRIP_UPDATE, tripId, name, fromDate, toDate
    }
}

type IImportLocation = {
    locationId: string,
    name: string,
    location: {
        long: number
        lat: number
        address: string
    },
    fromTime: moment.Moment
    toTime: moment.Moment
    images: {
        imageId: string,
        url: string, //url stored in local mobile
        time: Moment,
    }[]
}

export function importSelectedLocations(tripId: string, locations: IImportLocation[]): ImportSelectedLocations {
    return {
        type: IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS, tripId, locations,
    }
}

export function addInfographicId(tripId: string, infographicId: string): AddInfographicId {
    return {
        type: ADD_INFOGRAPHIC_ID, tripId, infographicId
    }
}

export type LocationActions = UpdateLocationFeeling
| UpdateLocationActivity
| UpdateLocationAddress
| UpdateLocationImages
| UpdateLocationHighlight
| UpdateLocationDescription
| ImageActions
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

type UpdateLocationHighlight = {
    type: "TRIP_LOCATION_UPDATE_HIGHLIGHT",
    dateIdx: number,
    locationId: string,
    highlights: StoreData.LocationLikeItemVM[]
}

type UpdateLocationDescription = {
    type: "TRIP_LOCATION_UPDATE_DESCRIPTION",
    dateIdx: number,
    locationId: string,
    description: string,
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

export function updateLocationImages(tripId: string, dateIdx: number, locationId: string, locationImages: StoreData.ImportImageVM[]) {
    return {
        type: LOCATION_UPDATE_IMAGES, tripId, dateIdx, locationId, locationImages
    }
}

export function updateLocationHighlight(tripId: string, dateIdx: number, locationId: string, highlights: Array<StoreData.LocationLikeItemVM>) {
    return {
        type: LOCATION_UPDATE_HIGHLIGHT, tripId, dateIdx, locationId, highlights
    }
}

export function updateLocationDescription(tripId: string, dateIdx: number, locationId: string, description: string) {
    return {
        type: LOCATION_UPDATE_DESCRIPTION, tripId, dateIdx, locationId, description
    }
}

export type ImageActions = {
    type: "TRIP_LOCATION_IMAGE...",
    tripId: string,
    dateIdx: number,
    locationId: string,
    imageId: string,
}
| UploadLocationImage
| AddLocationImage
| FavorLocationImage
// | UpdateLocationImageAsPatch
;

type UploadLocationImage = {
    type: "TRIP_LOCATION_IMAGE_UPLOAD",
    tripId: string,
    dateIdx: number,
    locationId: string,
    imageId: string,
    externalStorageId: string,
    thumbnailExternalUrl: string,
    externalUrl: string
}

type AddLocationImage = {
    type: "TRIP_LOCATION_IMAGE_ADD",
    tripId: string,
    dateIdx: number,
    locationId: string,
    imageId: string,

    url: string,
    time: Moment,
}

type FavorLocationImage = {
    type: "TRIP_LOCATION_IMAGE_FAVOR",
    tripId: string,
    dateIdx: number,
    locationId: string,
    imageId: string,
    isFavorite: boolean,
}


//intended to use this action to be all-purpose action for updating location image,
//but it seems to be very complex
type UpdateLocationImageAsPatch = {
    type: "TRIP_LOCATION_IMAGE_PATCH",
    tripId: string,
    dateIdx: number,
    locationId: string,
    imageId: string,

    //patch data
    url?: string,
    time?: Moment,
    externalStorageId?: string,
    externalUrl?: string;
    thumbnailExternalUrl?: string;
    isFavorite?: boolean,
}

export function addLocationImage(tripId: string, dateIdx: number, locationId: string, imageId: string, url: string, time: Moment): AddLocationImage {
    return {
        type: "TRIP_LOCATION_IMAGE_ADD",
        tripId, dateIdx, locationId, imageId,
        url, time,
    }
}

export function favorLocationImage(tripId: string, dateIdx: number, locationId: string, imageId: string, isFavorite: boolean): FavorLocationImage {
    return {
        type: LOCATION_IMAGE_FAVOR, tripId, dateIdx, locationId, imageId, isFavorite
    }
}

export function uploadLocationImage(tripId: string, dateIdx, locationId: string, imageId: string, externalStorageId: string, thumbnailExternalUrl: string, externalUrl: string): UploadLocationImage {
    return {
        type: "TRIP_LOCATION_IMAGE_UPLOAD", tripId, dateIdx, locationId, imageId, externalStorageId, thumbnailExternalUrl, externalUrl
    }
}