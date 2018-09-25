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
    location: LocationDetailVM
    images: Array<ImportImageVM>
}