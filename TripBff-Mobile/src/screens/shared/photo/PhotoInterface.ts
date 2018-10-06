export interface PhotoMetaData {
    image: {
        uri: string;
        height: number;
        width: number;
        based64?: string;
    };
    timestamp: number; //in seconds, for eaxample: 1537981200
    location: {
        latitude: number;
        longitude: number;
        altitude?: number; //not sure if we have anything
    };
}