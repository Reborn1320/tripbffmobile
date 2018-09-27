export const IMPORT_IMAGE_SELECT_UNSELECT_IMAGE = "TRIP/IMPORT_IMAGE_SELECT_UNSELECT_IMAGE"
export const IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES = "TRIP/IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES"

export function importImageSelectUnselectImage(tripId: number, locationIdx: number, imageIdx: number) {
    console.log(arguments)
    return {
        type: IMPORT_IMAGE_SELECT_UNSELECT_IMAGE, tripId, locationIdx, imageIdx
    }
}

export function importImageSelectUnselectAllImages(tripId: number, locationIdx: number) {
    return {
        type: IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES, tripId, locationIdx,
    }
}