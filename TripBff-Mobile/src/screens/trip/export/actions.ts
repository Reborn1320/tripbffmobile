export const ADD_INFOGRAPHIC_URI = "TRIP/ADD_INFOGRAPHIC_URI"


export function addInfographicUri(tripId: string, path: string) {
    return {
        type: ADD_INFOGRAPHIC_URI, tripId, path
    }
}