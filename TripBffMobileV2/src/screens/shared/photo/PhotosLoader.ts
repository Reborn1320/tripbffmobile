import { PhotoMetaData } from './PhotoInterface';
import _ from "lodash";
import { CameraRoll, GetPhotosReturnType } from "react-native";
import moment from "moment";

const PHOTOS_PER_BATCH = 20
async function loadPhotosWithinAsync(fromTimestamp: number, toTimestamp: number) {
    //timestamp from assets in expo use unix to milliseconds
    fromTimestamp = fromTimestamp;
    toTimestamp = toTimestamp;
    // console.log(fromTimestamp, toTimestamp);

    try {

        var photos: PhotoMetaData[] = []
        var result: GetPhotosReturnType;

        getphotos:
        while (fromTimestamp <= toTimestamp) {

            var afterCursor = result == undefined ? undefined : result.page_info.end_cursor;
            result = await CameraRoll.getPhotos({
                first: PHOTOS_PER_BATCH,
                assetType: 'Photos',
                after: afterCursor,
            });

            console.log(`get ${result.edges.length} photo(s)`);

            if (result.edges.length == 0) break;

            var oldestTimeStamp = result.edges[result.edges.length - 1].node.timestamp;
            var latestTimeStamp = result.edges[0].node.timestamp;

            console.log(oldestTimeStamp, latestTimeStamp);
            if (fromTimestamp > latestTimeStamp) break;
            else if (toTimestamp < oldestTimeStamp) continue;
            else {
                for (let idx = 0; idx < result.edges.length; idx++) {
                    const element = result.edges[idx];

                    console.log('photo created date: ' + moment(element.node.timestamp, "X").format("YYYY-MM-DD HH:mm"));

                    if (fromTimestamp <= element.node.timestamp && element.node.timestamp <= toTimestamp) {

                        photos.push({
                            image: {
                                uri: element.node.image.uri,
                                width: element.node.image.width,
                                height: element.node.image.height,
                                type: element.node.type,
                            },
                            timestamp: element.node.timestamp,
                            location: {
                                latitude: element.node.location ? element.node.location.latitude : 0,
                                longitude: element.node.location ? element.node.location.longitude : 0
                            }
                        });

                    }
                    else if (element.node.timestamp < fromTimestamp) break getphotos;
                }
            }

            if (!result.page_info.has_next_page) break;
        }
        console.log("first photo", photos[0]);

        return photos;
        // return _.orderBy(photos, 'timestamp', 'desc')

    } catch (error) {
        console.error(error)
    }
};

function _toTripImage() {

}

export default loadPhotosWithinAsync
