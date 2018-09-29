import { PhotoMetaData } from './PhotoInterface';
import { CameraRoll, GetPhotosReturnType } from 'react-native';

const PHOTOS_PER_BATCH = 20
const ASSET_TYPE = 'Photos'
async function loadPhotosWithinAsync(fromTimestamp: number, toTimestamp: number) {
    try {

        var photos: PhotoMetaData[] = []
        var result: GetPhotosReturnType
        var oldestTimeStamp = fromTimestamp + 1
        //fromTimeStamp -------------- oldestTimeStamp -------------- latestTimeStamp ------------- toTimeStamp
        while (fromTimestamp < oldestTimeStamp) {

            var afterCursor = result == undefined ? undefined : result.page_info.end_cursor
            result = await CameraRoll.getPhotos({
                first: PHOTOS_PER_BATCH,
                assetType: ASSET_TYPE,
                after: afterCursor
            })
            console.log(`get ${result.edges.length} photo(s)`)

            oldestTimeStamp = result.edges[result.edges.length - 1].node.timestamp
            var latestTimeStamp = result.edges[0].node.timestamp

            if (latestTimeStamp <= toTimestamp) {
                //add photos
                result.edges.forEach(element => {
                    if (element.node.timestamp >= fromTimestamp) {
                        photos.push(element.node)
                    }
                });
            }

            if (result.edges.length == 0) break;
            if (!result.page_info.has_next_page) break;

        }

        return photos

    } catch (error) {
        console.error(error)
    }
};

function _toTripImage() {

}

export default loadPhotosWithinAsync
