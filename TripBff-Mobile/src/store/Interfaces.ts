import * as moment from 'moment';
export module StoreData {
    export interface ImportImageVM {
        imageId: string,
        url: string, //url stored in local mobile
        externalStorageId?: string,
    }

    export interface LocationDetailVM {
        long: number
        lat: number
        address: string
    }

    export interface LocationVM {
        locationId: string
        location: LocationDetailVM //TODO: simplify this by removing the interface
        fromTime: moment.Moment
        toTime: moment.Moment
        images: Array<ImportImageVM>
    }

    export interface TripVM {
        tripId: string
        name: string
        fromDate: moment.Moment
        toDate: moment.Moment
        locations: Array<LocationVM>,
        infographicId: string
    }

    export interface UserVM {
        username: string
        email: string
        firstName: string
        lastName: string
        fullName: string

        token: string,
        fbToken?: string
        //TODO: expired time...
    }

    export interface BffStoreData {
        user?: UserVM
        trips?: Array<TripVM>
    }
}


export namespace RawJsonData {
    export interface TripVM {
        tripId: string
        name: string
        fromDate: string
        toDate: string
        locations: Array<StoreData.LocationVM>,
        infographicId: string
    }

    export interface LocationVM {
        locationId: string
        location: StoreData.LocationDetailVM
        fromTime: string
        toTime: string
        images: Array<StoreData.ImportImageVM>
    }

}