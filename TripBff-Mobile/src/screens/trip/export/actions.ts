export const ADD_INFOGRAPHIC_ID = "TRIP/ADD_INFOGRAPHIC_ID"


export function addInfographicId(tripId: string, infographicId: string) {
    return {
        type: ADD_INFOGRAPHIC_ID, tripId, infographicId
    }
}