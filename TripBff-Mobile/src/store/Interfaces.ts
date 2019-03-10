import * as moment from 'moment';
export module StoreData {
    export interface ImportImageVM {
        imageId: string,
        url: string, //url stored in local mobile
        externalStorageId?: string,
    }

    export interface FeelingVM {
        feelingId: number,
        label: string,
        icon: string
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
        images: Array<ImportImageVM>,
        feeling?: FeelingVM
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

    export interface RepoVM {
        repos: [],
        loading?: boolean,
        error?: string
    }

    export interface PreDefinedFeelingVM {
        feelingId: number,
        label: string,
        icon: string
    }

    export interface DataSourceVM {
        feelings?: Array<PreDefinedFeelingVM>
    }

    export interface BffStoreData {
        repo?: RepoVM
        user?: UserVM
        trips?: Array<TripVM>,
        dataSource: DataSourceVM
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
        feeling?: StoreData.FeelingVM
    }

}