export const IMPORT_IMAGE_SELECT_UNSELECT_IMAGE = "IMPORT_IMAGE_SELECT_UNSELECT_IMAGE"
export const IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES = "IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES"

export function importImageSelectUnselectImage(locationIdx: number, imageIdx: number) {
    return {
        type: IMPORT_IMAGE_SELECT_UNSELECT_IMAGE, locationIdx, imageIdx
    }
}

export function importImageSelectUnselectAllImages(locationIdx: number) {
    return {
        type: IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES, locationIdx,
    }
}