import { StoreData } from './../../../Interfaces';
export const IMPORT_IMAGE_SELECT_UNSELECT_IMAGE = "TRIP/IMPORT_IMAGE_SELECT_UNSELECT_IMAGE"
export const IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES = "TRIP/IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES"
export const IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS = "TRIP/IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS"


export function importImageSelectUnselectImage(tripId: number, locationIdx: number, imageIdx: number) {
    return {
        type: IMPORT_IMAGE_SELECT_UNSELECT_IMAGE, tripId, locationIdx, imageIdx
    }
}

export function importImageSelectUnselectAllImages(tripId: number, locationIdx: number) {
    return {
        type: IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES, tripId, locationIdx,
    }
}

export function importSelectedLocations(tripId: number, locations: StoreData.LocationVM[]) {
    return {
        type: IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS, tripId, locations,
    }
}

export function makeASandwich(data) {
    return {
      type: 'MAKE_SANDWICH',
      data
    };
  }