import * as moment from 'moment';
export module StoreData {
    export interface ImportImageVM {
        url: string
    }

    export interface LocationDetailVM {
        long: number
        lat: number
        address: string
    }

    export interface LocationVM {
        location: LocationDetailVM //TODO: simplify this by removing the interface
        fromTime: moment.Moment
        toTime: moment.Moment
        images: Array<ImportImageVM>
    }

    export interface TripVM {
        id: number
        name: string
        fromDate: moment.Moment
        toDate: moment.Moment
        locations: Array<LocationVM>
    }

    export interface UserVM {
        username: string
        email: string
        firstName: string
        lastName: string
        fullName: string

        token: string
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