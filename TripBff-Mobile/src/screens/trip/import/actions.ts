import { StoreData } from '../../../store/Interfaces';
import { ThunkResultBase } from '../../../store/index';
export const IMPORT_IMAGE_SELECT_UNSELECT_IMAGE = "TRIP/IMPORT_IMAGE_SELECT_UNSELECT_IMAGE"
export const IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES = "TRIP/IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES"
export const IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS = "TRIP/IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS"
export const IMPORT_UPLOADED_IMAGE = "TRIP/IMPORT_UPLOADED_IMAGE"


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

export function uploadedImage(tripId: number, dateIdx, locationId: string, imageId: string, externalStorageId: string, thumbnailExternalUrl: string) {
    
    return {
        type: IMPORT_UPLOADED_IMAGE, tripId, dateIdx, locationId, imageId, externalStorageId, thumbnailExternalUrl
    }
}

export function uploadImage(tripId, locationId, imageId, imgUrl): ThunkResultBase {
    //todo check getState param ?? is it state of the store ????
    return async function(dispatch, getState, extraArguments) {
        console.log(`imge url: ${imgUrl}`)
        var additionalData = {
            locationId,
            imageId,
            fileName: imgUrl,
        }

        var url = '/trips/' + tripId +'/uploadImage';

        return extraArguments.uploadApi.upload(url, imgUrl, additionalData)
        .then((res) => {
            console.log('result after upload image: ' + JSON.stringify(res));
            console.log('result after upload image: ' + JSON.stringify(res.data));
            var externalStorageId: string = res.response;      
            dispatch(uploadedImage(tripId, locationId, imageId, externalStorageId))
            //todo replace by stop on error
        })
        .catch((err) => {
            console.log('error after import trip: ' + JSON.stringify(err));
        });
    }
}