
export const LOCATION_REMOVE = "LOCATION_REMOVE"

export function removeLocation(tripId: string, locationId: string) {
    return {
        type: LOCATION_REMOVE, tripId, locationId
    }
}