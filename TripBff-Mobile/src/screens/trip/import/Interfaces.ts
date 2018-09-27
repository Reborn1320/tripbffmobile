export interface ImportImageVM {
    url: string
    isSelected: boolean
}

export interface LocationDetailVM {
    long: number
    lat: number
    address: string
}

export interface LocationVM {
    location: LocationDetailVM //TODO: change to details
    images: Array<ImportImageVM>
}

export interface TripVM {
    id: number
    locations: Array<LocationVM>
}