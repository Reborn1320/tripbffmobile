export interface PhotoMetaData {
    type: string;
    group_name: string;
    image: {
        uri: string;
        height: number;
        width: number;
        isStored?: boolean;
    };
    timestamp: number;
    location: {
        latitude: number;
        longitude: number;
        altitude: number;
        heading: number;
        speed: number;
    };
}