import { StoreData } from '../../../store/Interfaces';

export const TRIP_ADD = "TRIP_ADD"

export function createTrip(trip: StoreData.TripVM) {
    return {
        type: TRIP_ADD, trip
    }
}