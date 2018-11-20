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


// export const IMPORT_LOCATIONS = 'TRIP/IMPORT/IMPORT_LOCATIONS';
// export const IMPORT_LOCATIONS_SUCCESS = 'TRIP/IMPORT/IMPORT_LOCATIONS_SUCCESS';
// export const IMPORT_LOCATIONS_FAIL = 'TRIP/IMPORT/IMPORT_LOCATIONS_FAIL';

// export default function importLocationsReducer(state: StoreData.TripVM, action): StoreData.TripVM {
//   switch (action.type) {
//     case IMPORT_LOCATIONS:
//       return { ...state, loading: true };
//     case IMPORT_LOCATIONS_SUCCESS:
//       return { ...state, loading: false, repos: action.payload.data };
//     case IMPORT_LOCATIONS_FAIL:
//       return {
//         ...state,
//         loading: false,
//         error: 'Error while fetching repositories'
//       };
//     default:
//       return state;
//   }
// }

// export function listRepos(user) {
//   return {
//     type: GET_REPOS,
//     payload: {
//       request: {
//         url: `/users/${user}/repos`
//       }
//     }
//   };
// }

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