import { cloneDeep } from 'lodash';
import { StoreData } from './../../../Interfaces';
import { IMPORT_IMAGE_SELECT_UNSELECT_IMAGE, IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES, IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS } from "./actions";

// function selectUnselectImage(state: StoreData.TripVM, action) {
//     //TODO: improve type definition for action
//     const { locationIdx, imageIdx } = action

//     var newState = cloneDeep(state)
//     var img = newState.locations[locationIdx].images[imageIdx]

//     img.isSelected = !img.isSelected

//     return newState;
// }

// function selectUnselectAllImages(state: StoreData.TripVM, action) {
//     const { locationIdx } = action

//     var newState = cloneDeep(state)

//     var newIsSelected = false;
//     var nSelected = newState.locations[locationIdx].images.filter((item) => item.isSelected).length;

//     if (nSelected == 0) {
//         newIsSelected = true;
//     }
//     newState.locations[locationIdx].images.forEach((item) => item.isSelected = newIsSelected)

//     return newState;
// }

function importSelectedLocations(state: StoreData.TripVM, action) {
    const { locations } = action

    var newState = cloneDeep(state)
    newState.locations = locations

    return newState;
}

function importImagesReducer(state: StoreData.TripVM, action) {
    switch (action.type) {
        // case IMPORT_IMAGE_SELECT_UNSELECT_IMAGE:
        //     return selectUnselectImage(state, action)
        // case IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES:
        //     return selectUnselectAllImages(state, action)
        case IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS:
            return importSelectedLocations(state, action)
        default:
            return state;
    }
}

export default importImagesReducer;