import * as moment from 'moment';

export module StoreData {

    export type IMimeTypeImage = "image/jpeg" | "image/png"

    export interface ImportImageVM {
        imageId: string,
        url: string, //url stored in local mobile
        time: moment.Moment,
        externalStorageId?: string,
        externalUrl: string;
        thumbnailExternalUrl: string;
        isFavorite: boolean;
        type: IMimeTypeImage
    }

    export type LikeTypeVM = "Like" | "Dislike";

    export interface LocationLikeItemVM {
        highlightId: string,
        label: string,
        highlightType: LikeTypeVM
    }

    export interface FeelingVM {
        feelingId: string,
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
        images: Array<ImportImageVM>, //TODO change class name...
        feeling?: FeelingVM,
        activity?: ActivityVM,
        highlights?: Array<LocationLikeItemVM>,
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
        dates?: Array<DateVM>     
        infographicId?: string,
        rawLocations?: Array<LocationVM>,
        isDeleted?: boolean  
    }


    export interface MinimizedTripVM {
        tripId: string
        name: string
        fromDate: moment.Moment
        toDate: moment.Moment   
        locationImages: {
            name: string,
            address: string,
            description: string,
            imageUrl: string,
        }[],
        isDeleted?: boolean
    }

    export interface UserVM {
        id: string,
        username: string
        email: string
        fullName: string

        token: string,
        facebook?: {
            accessToken
        }
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
        feelingId: string,
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
        user?: UserVM
        trips?: Array<MinimizedTripVM>,
        currentTrip?: TripVM,
        currentMinimizedTrip?: MinimizedTripVM,
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

    export interface MinimizedTripVM {
        tripId: string
        name: string
        fromDate: string
        toDate: string
        locationImages: {
            name: string,
            address: string,
            description: string,
            imageUrl: string,
        }[],
        isDeleted: boolean
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