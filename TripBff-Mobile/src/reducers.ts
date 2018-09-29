import _, { cloneDeep } from 'lodash';
import { BffStoreData, UserVM, TripVM, LocationVM } from "./Interfaces";
import importImagesReducer from "./screens/trip/import/reducers";
import homeScreenReducer from "./screens/home/reducer";
import ImportImageScreenData from "./fake_data";

const userInitState: UserVM = {
    username: "asdf",
    lastName: "asdf",
    firstName: "asdf",
    fullName: "adffff",
    email: "asdf@gmail.com",
    token: "ASdf"
}
const locationInitState: LocationVM[] = ImportImageScreenData
const tripsInitState: TripVM[] = []
for (let idx = 0; idx < 5; idx++) {
    tripsInitState.push({
        id: idx,
        name: `trip name ${idx}`,
        locations: cloneDeep(locationInitState)
    })
}
const initState: BffStoreData = {
    user: userInitState,
    trips: tripsInitState
}



function userReducer(state, action) {
    return state;
}

function tripReducer(state, action) {
    //TODO: combine with other reducer if needed
    return importImagesReducer(state, action)
}

function tripsReducer(state, action) {
    const actionType: String = action.type
    if (actionType.search(/^TRIP\//i) !== -1) {
        //handle single trip
        var trip = _.find(state, (item) => item.id == action.tripId)

        var newState = [
            ...state.slice(0, action.tripId),
            tripReducer(trip, action),
            ...state.slice(action.tripId + 1)
        ];

        return newState
    }

    return state;
}

export default function bffApp(state: BffStoreData = initState, action): BffStoreData {
    return {
        repo: homeScreenReducer(state.repo, action),
        user: userReducer(state.user, action),
        trips: tripsReducer(state.trips, action)
    }
}