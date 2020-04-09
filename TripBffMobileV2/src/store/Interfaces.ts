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
        label_en: string,
        label_vi: string,
        highlightType: LikeTypeVM
    }

    export interface FeelingVM {
        feelingId: string,
        label_en: string,
        label_vi: string,
        icon: string
    }

    export interface ActivityVM {
        activityId: number,
        label_en: string,
        label_vi: string,
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
        isPublic: boolean 
        dates?: Array<DateVM>     
        infographicId?: string,
        latestExportedExternalStorageId: string,
        rawLocations?: Array<LocationVM>,
        isDeleted?: boolean,
        createdById: string,
        canContribute: boolean
    }


    export interface MinimizedTripVM {
        tripId: string
        name: string
        fromDate: moment.Moment
        toDate: moment.Moment
        isPublic: boolean
        locationImages: {
            name: string,
            address: string,
            description: string,
            imageUrl: string,
        }[],
        isDeleted?: boolean,
        createdById: string,
        canContribute: boolean
    }

    export interface UserVM {
        id: string,
        username: string
        email: string
        fullName: string

        token: string,
        facebook?: {
            accessToken,
            id: string
        },
        locale: string
        //TODO: expired time...
    }

    export interface RepoVM {
        repos: [],
        loading?: boolean,
        error?: string
    }

    export interface PreDefinedHighlightVM {
        highlightId: string,
        label_en: string,
        label_vi: string,
        highlightType: LikeTypeVM
    }

    export interface PreDefinedFeelingVM {
        feelingId: string,
        label_en: string,
        label_vi: string,
        icon: string
    }

    export interface PreDefinedActivityVM {
        activityId: number,
        label_en: string,
        label_vi: string,
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
        publicTrips?: Array<MinimizedTripVM>,
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
        isPublic: boolean
        locations: Array<StoreData.LocationVM>,
        infographicId: string,
        createdById: string,
        canContribute: boolean,
        latestExportedExternalStorageId: string
    }

    export interface MinimizedTripVM {
        tripId: string
        name: string
        fromDate: string
        toDate: string
        isPublic: boolean
        locationImages: {
            name: string,
            address: string,
            description: string,
            imageUrl: string,
        }[],
        isDeleted: boolean,
        createdById: string,
        canContribute: boolean
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