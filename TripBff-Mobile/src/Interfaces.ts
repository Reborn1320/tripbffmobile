//TODO: make sure screen don't necessary depend on this data
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