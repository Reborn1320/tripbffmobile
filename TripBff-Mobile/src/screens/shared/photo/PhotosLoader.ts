import { PhotoMetaData } from './PhotoInterface';
import { MediaLibrary } from 'expo';
import _ from "lodash";

const PHOTOS_PER_BATCH = 20
const mediaType = MediaLibrary.MediaType.photo
//TODO: import filter by camera only
async function loadPhotosWithinAsync(fromTimestamp: number, toTimestamp: number) {

    //timestamp from assets in expo use unix to miliseconds
    fromTimestamp = fromTimestamp * 1000;
    toTimestamp = toTimestamp * 1000;
    try {

        var photos: PhotoMetaData[] = []
        var result: MediaLibrary.GetAssetsResult
        var oldestTimeStamp = fromTimestamp + 1
        //fromTimeStamp -------------- oldestTimeStamp -------------- latestTimeStamp ------------- toTimeStamp
        while (fromTimestamp < oldestTimeStamp) {

            var afterCursor = result == undefined ? undefined : result.endCursor
            result = await MediaLibrary.getAssetsAsync({
                first: PHOTOS_PER_BATCH,
                mediaType: mediaType,
                sortBy: MediaLibrary.SortBy.creationTime,
                after: afterCursor,
            })
            console.log(`get ${result.assets.length} photo(s)`)
            // console.log(result.assets)

            oldestTimeStamp = result.assets[result.assets.length - 1].creationTime
            var latestTimeStamp = result.assets[0].creationTime

            if (latestTimeStamp <= toTimestamp) {
                //add photos
                for (let idx = 0; idx < result.assets.length; idx++) {
                    const element = result.assets[idx];
                    
                    if (element.creationTime >= fromTimestamp) {
                        var fullElement = await MediaLibrary.getAssetInfoAsync(element)

                        if (fullElement.localUri.indexOf("Camera") == -1) continue;
                        console.log(fullElement)
                        photos.push({
                            image: {
                                uri: fullElement.uri,
                                width: fullElement.width,
                                height: fullElement.height,
                            },
                            timestamp: fullElement.creationTime / 1000,
                            location: {
                                latitude: fullElement.location.latitude,
                                longitude: fullElement.location.longitude
                            }
                        });
                    }
                }
            }

            if (result.assets.length == 0) break;
            if (!result.hasNextPage) break;

        }

        return photos;
        // return _.orderBy(photos, 'timestamp', 'desc')

    } catch (error) {
        console.error(error)
    }
};

function _toTripImage() {

}

export default loadPhotosWithinAsync
