import { cloneDeep } from 'lodash';
import { TripVM } from './../../../Interfaces';
import { IMPORT_IMAGE_SELECT_UNSELECT_IMAGE, IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES } from "./actions";

function selectUnselectImage(state: TripVM, action) {
    const {locationIdx, imageIdx} = action

    var newState = cloneDeep(state)
    var img = newState.locations[locationIdx].images[imageIdx]
    
    img.isSelected = !img.isSelected
    
    return newState;
}

function selectUnselectAllImages(state: TripVM, action) {
    return state;
}

function importImagesReducer(state: TripVM, action) {
    switch (action.type) {
        case IMPORT_IMAGE_SELECT_UNSELECT_IMAGE:
            return selectUnselectImage(state, action)
        case IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES:
            return selectUnselectAllImages(state, action)
        default:
            return state;
    }
}

export default importImagesReducer;