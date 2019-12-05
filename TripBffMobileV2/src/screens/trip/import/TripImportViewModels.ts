
import moment, { Moment } from "moment";
export interface TripImportLocationVM {
  id: string,
  name: string,
  location: TripImportLocationDetailVM,
  nearerLocations: TripImportLocationDetailVM[],
  fromTime: moment.Moment
  toTime: moment.Moment

  images: TripImportImageVM[]
}

export interface TripImportImageVM {
  imageId: string,
  url: string, //url stored in local mobile
  time: Moment,
  externalStorageId?: string,
  isSelected: boolean
}

export interface TripImportLocationDetailVM {
  name: string,
  long: number
  lat: number
  address: string
}