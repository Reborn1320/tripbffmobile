import _, { cloneDeep } from 'lodash';
import moment from "moment";
import { StoreData } from "./Interfaces";
// import importImagesReducer from "./screens/trip/import/reducers";
import homeScreenReducer from "./screens/home/reducer";
import ImportImageScreenData from "./fake_data";

const userInitState: StoreData.UserVM = {
    username: "asdf",
    lastName: "asdf",
    firstName: "asdf",
    fullName: "adffff",
    email: "asdf@gmail.com",
    token: "ASdf"
}
const locationInitState: StoreData.LocationVM[] = ImportImageScreenData
const tripsInitState: StoreData.TripVM[] = []
for (let idx = 0; idx < 5; idx++) {
    tripsInitState.push({
        id: idx,
        name: `trip name ${idx}`,
        fromDate: moment("2018-09-27"), 
        toDate: moment("2018-09-29").add(1, "day"),
        locations: [] // cloneDeep(locationInitState)
    })
}

tripsInitState.push({
    id: 5,
    name: `trip name ${5}`,
    fromDate: moment("2018-08-01"), 
    toDate: moment("2018-09-29").add(1, "day"),
    locations: [] // cloneDeep(locationInitState)
})

const initState: StoreData.BffStoreData = {
    user: userInitState,
    trips: tripsInitState
}



function userReducer(state, action) {
    return state;
}

function tripReducer(state, action) {
    //TODO: combine with other reducer if needed
    return state;
    // return importImagesReducer(state, action)
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

export default function bffApp(state: StoreData.BffStoreData = initState, action): StoreData.BffStoreData {
    return {
        repo: homeScreenReducer(state.repo, action),
        user: userReducer(state.user, action),
        trips: tripsReducer(state.trips, action)
    }
}