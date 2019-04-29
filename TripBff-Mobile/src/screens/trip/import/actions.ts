import { ThunkResultBase } from '../../../store/index';
import { uploadedImage } from '../../../store/Trip/actions';

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
            var externalStorageId: string = res.data;      
            dispatch(uploadedImage(tripId, 0, locationId, imageId, externalStorageId))
            //todo replace by stop on error
        })
        .catch((err) => {
            console.log('error after import trip: ' + JSON.stringify(err));
        });
    }
}