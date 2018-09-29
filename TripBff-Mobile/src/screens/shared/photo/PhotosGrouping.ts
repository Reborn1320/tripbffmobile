import { LocationVM } from './../../../Interfaces';
import { PhotoMetaData } from './PhotoInterface';
export default function GroupPhotosIntoLocations(photoMetadatas: PhotoMetaData[]): LocationVM[] {

    var locations: LocationVM[] = []

    var location: LocationVM
    photoMetadatas.forEach((element, index) => {
        if (index % 5 == 0) {
            location = {
                location: {
                    long: 0,
                    lat: 0,
                    address: "Ho Chi Minh city"
                },
                images: [

                ]
            }
            locations.push(location)
        }
        else {
            location.images.push({
                url: element.image.uri,
                isSelected: true
            })
        }
    });
    return locations
}