import { PhotoMetaData } from './PhotoInterface';
import { MediaLibrary } from 'expo';
import _ from "lodash";
import { Platform } from "react-native";
import moment from "moment";

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

        getphotos:
        while (fromTimestamp <= toTimestamp) {

            var afterCursor = result == undefined ? undefined : result.endCursor
            result = await MediaLibrary.getAssetsAsync({
                first: PHOTOS_PER_BATCH,
                mediaType: mediaType,
                sortBy: MediaLibrary.SortBy.creationTime,
                after: afterCursor,
            })

            console.log(`get ${result.assets.length} photo(s)`);         

            if (result.assets.length == 0) break;

            var oldestTimeStamp = result.assets[result.assets.length - 1].creationTime;
            var latestTimeStamp = result.assets[0].creationTime;
            
            if (fromTimestamp > latestTimeStamp) break;
            else if (toTimestamp < oldestTimeStamp) continue;
            else {
                for (let idx = 0; idx < result.assets.length; idx++) {
                    const element = result.assets[idx];
    
                    //console.log('photo created date: ' + moment(element.creationTime).format("YYYY-MM-DD HH:mm"));
                    
                    if (fromTimestamp <= element.creationTime && element.creationTime <= toTimestamp) {
                        var fullElement = await MediaLibrary.getAssetInfoAsync(element)                        

                        if (fullElement) {
                            console.log('full element: ' + fullElement.localUri);
                            
                            // if ((fullElement.localUri.indexOf("Camera") == -1 && Platform.OS === "android") || 
                            // (fullElement.localUri.indexOf("Media") == -1 && Platform.OS === "ios")) continue;                   

                            if (fullElement.location == null || fullElement.location == undefined) {
                                fullElement.location = { latitude: 0, longitude: 0 } 
                            }

                            //TODO: check why can not get long, lat of image
                            //console.log('full element long : ' + fullElement.location.longitude);

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
                    else if (element.creationTime < fromTimestamp) break getphotos;
                }
            }

            
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
