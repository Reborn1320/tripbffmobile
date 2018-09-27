import { combineReducers } from "redux";
import { IMPORT_IMAGE_SELECT_UNSELECT_IMAGE, IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES } from "./actions";
import ImportImageScreenData from "./fake_data";
import { LocationVM } from "../../../Interfaces";

const initialData = ImportImageScreenData;

//TODO: sub-store state
//TODO: define 
function selectUnselectImage(state: Array<LocationVM>) {
    return state;
}

function selectUnselectAllImages(state: Array<LocationVM>) {
    return state;
}

function importImagesReducer(state: Array<LocationVM> = [], action) {
    switch (action.type) {
        case IMPORT_IMAGE_SELECT_UNSELECT_IMAGE:
            return selectUnselectImage(state)
        case IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES:
            return selectUnselectAllImages(state)
        default:
            return state;
    }
}

export default importImagesReducer;