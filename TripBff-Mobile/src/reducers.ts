import _, { cloneDeep } from 'lodash';
import moment from "moment";
import { StoreData } from "./Interfaces";
// import importImagesReducer from "./screens/trip/import/reducers";
import homeScreenReducer from "./screens/home/reducer";
import ImportImageScreenData from "./fake_data";
import importImagesReducer from './screens/trip/import/reducers';
import { TRIP_ADD } from './screens/trip/create/actions';
import { AUTH_ADD_TOKEN } from './screens/auth/actions';
import { ADD_INFOGRAPHIC_URI } from './screens/trip/export/actions';

const userInitState: StoreData.UserVM = {
    username: "asdf",
    lastName: "asdf",
    firstName: "asdf",
    fullName: "adffff",
    email: "asdf@gmail.com",
    token: "ASdf",
    fbToken: ""
}
const locationInitState: StoreData.LocationVM[] = ImportImageScreenData
const tripsInitState: StoreData.TripVM[] = []
for (let idx = 0; idx < 5; idx++) {
    tripsInitState.push({
        id: idx.toString(),
        name: `trip name ${idx}`,
        fromDate: moment("2018-10-10"), 
        toDate: moment("2018-10-18").add(1, "day").add(-1, "second"),
        localInfographicUri: '',
        locations: [] // cloneDeep(locationInitState)
    })
}

tripsInitState.push({
    id: '5',
    name: `trip name ${5}`,
    fromDate: moment("2018-10-04"), 
    toDate: moment("2018-10-29").add(1, "day").add(-1, "second"),
    localInfographicUri: '',
    locations: [] // cloneDeep(locationInitState)
})

const initState: StoreData.BffStoreData = {
    user: userInitState,
    trips: tripsInitState
}

function userReducer(state, action) {
    if (action.type == AUTH_ADD_TOKEN) {
        return action.user;
    }

    return state;
}

function tripReducer(state, action) {
    //TODO: combine with other reducer if needed
    // return state;

    if (action.type == ADD_INFOGRAPHIC_URI) {
        return Object.assign({}, state, {
            localInfographicUri: action.path
          });
    }

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
    else if (actionType == TRIP_ADD) {
        return [...state, action.trip];
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