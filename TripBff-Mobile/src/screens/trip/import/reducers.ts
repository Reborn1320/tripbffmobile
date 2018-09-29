import { cloneDeep } from 'lodash';
import { TripVM } from './../../../Interfaces';
import { IMPORT_IMAGE_SELECT_UNSELECT_IMAGE, IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES } from "./actions";

function selectUnselectImage(state: TripVM, action) {
    //TODO: improve type definition for action
    const { locationIdx, imageIdx } = action

    var newState = cloneDeep(state)
    var img = newState.locations[locationIdx].images[imageIdx]

    img.isSelected = !img.isSelected

    return newState;
}

function selectUnselectAllImages(state: TripVM, action) {
    const { locationIdx } = action

    var newState = cloneDeep(state)

    var newIsSelected = false;
    var nSelected = newState.locations[locationIdx].images.filter((item) => item.isSelected).length;

    if (nSelected == 0) {
        newIsSelected = true;
    }
    newState.locations[locationIdx].images.forEach((item) => item.isSelected = newIsSelected)

    return newState;
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