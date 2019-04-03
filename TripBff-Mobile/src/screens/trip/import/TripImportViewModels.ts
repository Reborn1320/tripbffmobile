
import moment from "moment";
export interface TripImportLocationVM {
  id: string,
  name: string,
  location: TripImportLocationDetailVM
  fromTime: moment.Moment
  toTime: moment.Moment

  images: Array<TripImportImageVM>
}

export interface TripImportImageVM {
  imageId: string,
  url: string, //url stored in local mobile
  externalStorageId?: string,
  isSelected: boolean
}

export interface TripImportLocationDetailVM {
  long: number
  lat: number
  address: string
}
