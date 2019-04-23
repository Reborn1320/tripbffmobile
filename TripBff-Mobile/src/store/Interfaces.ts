import * as moment from 'moment';

export module StoreData {
    export interface ImportImageVM {
        imageId: string,
        url: string, //url stored in local mobile
        externalStorageId?: string,
        externalUrl: string;
        thumbnailExternalUrl: string;
    }

    export type LikeTypeVM = "Like" | "Dislike";

    export interface LocationLikeItemVM {
        highlightId: string,
        label: string,
        highlightType: LikeTypeVM
    }

    export interface FeelingVM {
        feelingId: number,
        label: string,
        icon: string
    }

    export interface ActivityVM {
        activityId: number,
        label: string,
        icon: string
    }

    export interface LocationDetailVM {
        long: number
        lat: number
        address: string
    }

    export interface LocationVM {
        locationId: string,
        name: string,
        location: LocationDetailVM //TODO: simplify this by removing the interface
        fromTime: moment.Moment
        toTime: moment.Moment
        images: Array<ImportImageVM>,
        feeling?: FeelingVM,
        activity?: ActivityVM,
        likeItems?: Array<LocationLikeItemVM>,
        description?: string
    }

    export interface DateVM {
        dateIdx: number,
        date: moment.Moment,
        locations: Array<LocationVM>, 
        locationIds: Array<string>,    
    }
   
    export interface TripVM {
        tripId: string
        name: string
        fromDate: moment.Moment
        toDate: moment.Moment   
        dates: Array<DateVM>     
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

    export interface PreDefinedHighlightVM {
        highlightId: string,
        label: string,
        highlightType: LikeTypeVM
    }

    export interface PreDefinedFeelingVM {
        feelingId: number,
        label: string,
        icon: string
    }

    export interface PreDefinedActivityVM {
        activityId: number,
        label: string,
        icon: string
    }

    export interface DataSourceVM {
        feelings?: Array<PreDefinedFeelingVM>,
        activities?: Array<PreDefinedActivityVM>,
        highlights?: Array<PreDefinedHighlightVM>
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
        feeling?: StoreData.FeelingVM,
        activity?: StoreData.ActivityVM
    }

    export interface LocationAddressVM {
        name: string,
        address: string,
        long: number,
        lat: number
    }
}