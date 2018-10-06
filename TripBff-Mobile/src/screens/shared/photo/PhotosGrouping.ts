import { LocationVM } from './../../../Interfaces';
import { PhotoMetaData } from './PhotoInterface';
import moment from "moment";

export default function GroupPhotosIntoLocations(photoMetadatas: PhotoMetaData[]): LocationVM[] {
    console.log(photoMetadatas);
    var locations: LocationVM[] = []

    var location: LocationVM
    var previousMetaDatas = undefined;
    for (let idx = 0; idx < photoMetadatas.length; idx++) {
        const element = photoMetadatas[idx];

        var isSameGroup = false

        if (previousMetaDatas != undefined) {
            if (isApproximatelyTheSamePlace(previousMetaDatas, element)) {
                if (isApproximatelyTheSameTime(previousMetaDatas, element)) {
                    isSameGroup = true
                }
            }

        }

        if (isSameGroup) {
            addImage(location, element)
        }
        else {
            location = addImageInNewLocation(locations, element)
        }

        previousMetaDatas = element;
    }
    return locations
}

function addImage(location: LocationVM, element: PhotoMetaData) {
    location.images.push({
        url: element.image.uri,
        isSelected: true
    })
}

function addImageInNewLocation(locations: LocationVM[], element: PhotoMetaData): LocationVM {
    var location = newLocation(element.location.latitude, element.location.longitude, "Ho Chi Minh city")
    locations.push(location)
    location.images.push({
        url: element.image.uri,
        isSelected: true
    })

    return location;
}

function isApproximatelyTheSameTime(previousMetaDatas: PhotoMetaData, element: PhotoMetaData): boolean {
    var deltaSeconds = moment.duration(Math.abs(previousMetaDatas.timestamp - element.timestamp), "seconds");
    return deltaSeconds < moment.duration(3600 * 2, "seconds");
}

function isApproximatelyTheSamePlace(previousMetaDatas: PhotoMetaData, element: PhotoMetaData): boolean {
    return distance(previousMetaDatas.location.latitude, previousMetaDatas.location.longitude,
        element.location.latitude, element.location.longitude) < 0.5;
}

function newLocation(lat: number, long: number, address: string): LocationVM {
    return {
        location: {
            lat: lat,
            long: long,
            address: address
        },
        images: [

        ]
    }
}

//https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function distance(lat1, lon1, lat2, lon2): number {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}