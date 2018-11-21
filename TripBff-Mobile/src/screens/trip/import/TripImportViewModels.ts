
import moment from "moment";
export interface TripImportLocationVM {
  id: number
  location: TripImportLocationDetailVM
  fromTime: moment.Moment
  toTime: moment.Moment

  images: Array<TripImportImageVM>
}

export interface TripImportImageVM {
  url: string
  isSelected: boolean
}

export interface TripImportLocationDetailVM {
  long: number
  lat: number
  address: string
}
