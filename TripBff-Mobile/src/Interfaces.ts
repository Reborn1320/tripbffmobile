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
        id: string
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

    //testing home screen
    export interface RepoVM {
        loading?: boolean
        repos: Array<string>
        error?: string
    }

    export interface BffStoreData {
        repo?: RepoVM
        user?: UserVM
        trips?: Array<TripVM>
    }
}