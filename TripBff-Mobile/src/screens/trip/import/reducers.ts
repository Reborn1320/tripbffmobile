// import { cloneDeep } from 'lodash';
// import { StoreData } from '../../../store/Interfaces';
// import _ from 'lodash'
// import { IMPORT_IMAGE_SELECT_UNSELECT_IMAGE, IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES, IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS, IMPORT_UPLOADED_IMAGE } from "./actions";
// import moment = require('moment');

// // function selectUnselectImage(state: StoreData.TripVM, action) {
// //     //TODO: improve type definition for action
// //     const { locationIdx, imageIdx } = action

// //     var newState = cloneDeep(state)
// //     var img = newState.locations[locationIdx].images[imageIdx]

// //     img.isSelected = !img.isSelected

// //     return newState;
// // }

// // function selectUnselectAllImages(state: StoreData.TripVM, action) {
// //     const { locationIdx } = action

// //     var newState = cloneDeep(state)

// //     var newIsSelected = false;
// //     var nSelected = newState.locations[locationIdx].images.filter((item) => item.isSelected).length;

// //     if (nSelected == 0) {
// //         newIsSelected = true;
// //     }
// //     newState.locations[locationIdx].images.forEach((item) => item.isSelected = newIsSelected)

// //     return newState;
// // }

// function compareLocationsFromTime(first, second) {
//     if (first.fromTime < second.fromTime) 
//         return -1
//     else if (first.fromTime > second.fromTime)
//         return 1
//     else
//         return 0;
// }

// function importSelectedLocations(state: StoreData.TripVM, action) {
//     const { locations } = action
//     var dateVMs: StoreData.DateVM[] = [];
//     const nDays = state.toDate.diff(state.fromDate, "days") + 1

//     for (let idx = 0; idx < nDays; idx++) {
//         var locationsOfDate = locations.filter(element => moment(element.fromTime).diff(state.fromDate, "days") == idx);

//         dateVMs.push({
//             idx: idx + 1,
//             date: moment(state.fromDate.add(idx, 'days')),
//             locationIds: locationsOfDate.map(e => { return e.locationId }),
//             locations: locationsOfDate.sort(compareLocationsFromTime).map(e => { return e })
//         })
//     }

//     var newState = cloneDeep(state)
//     newState.dates = dateVMs
//     return newState;
// }

// function uploadedImage(state: StoreData.TripVM, action) {
//     const { locationId, imageId, externalStorageId } = action

//     var newState = cloneDeep(state)
//     var location = _.find(newState.locations, loc => loc.locationId == locationId)
//     var image = _.find(location.images, img => img.imageId == imageId);
//     image.externalStorageId = externalStorageId;
    
//     return newState;
// }

// function importImagesReducer(state: StoreData.TripVM, action) {
//     switch (action.type) {
//         // case IMPORT_IMAGE_SELECT_UNSELECT_IMAGE:
//         //     return selectUnselectImage(state, action)
//         // case IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES:
//         //     return selectUnselectAllImages(state, action)
//         case IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS:
//             return importSelectedLocations(state, action)
//         case IMPORT_UPLOADED_IMAGE:
//             return uploadedImage(state, action)
//         default:
//             return state;
//     }
// }

// export default importImagesReducer;