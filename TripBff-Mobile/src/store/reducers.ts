import _, { cloneDeep } from 'lodash';
import moment from "moment";
import { StoreData } from "./Interfaces";
// import importImagesReducer from "./screens/trip/import/reducers";
import homeScreenReducer from "../screens/home/reducer";
import importImagesReducer from '../screens/trip/import/reducers';
import { TRIP_ADD } from '../screens/trip/create/actions';
import { AUTH_ADD_TOKEN } from './User/actions';
import { ADD_INFOGRAPHIC_ID } from '../screens/trip/export/actions';
import { LOCATION_REMOVE } from './Trip/actions';

const userInitState: StoreData.UserVM = {
    username: "asdf",
    lastName: "asdf",
    firstName: "asdf",
    fullName: "adffff",
    email: "asdf@gmail.com",
    token: "ASdf",
    fbToken: ""
}
// const tripsInitState: StoreData.TripVM[] = []
// for (let idx = 0; idx < 5; idx++) {
//     tripsInitState.push({
//         tripId: idx.toString(),
//         name: `trip name ${idx}`,
//         fromDate: moment("2018-10-10"), 
//         toDate: moment("2018-10-18").add(1, "day").add(-1, "second"),
//         infographicId: '',
//         locations: [] // cloneDeep(locationInitState)
//     })
// }

// tripsInitState.push({
//     tripId: '5',
//     name: `trip name ${5}`,
//     fromDate: moment("2018-10-04"), 
//     toDate: moment("2018-10-29").add(1, "day").add(-1, "second"),
//     infographicId: '',
//     locations: [] // cloneDeep(locationInitState)
// })

const initState: StoreData.BffStoreData = {
    user: userInitState,
    trips: [] // tripsInitState
}

function userReducer(state, action) {
    if (action.type == AUTH_ADD_TOKEN) {
        return action.user;
    }

    return state;
}

function tripReducer(state: StoreData.TripVM, action) {
    //TODO: combine with other reducer if needed
    // return state;

    if (action.type == ADD_INFOGRAPHIC_ID) {
        return Object.assign({}, state, {
            infographicId: action.infographicId
          });
    }
    else if (action.type == LOCATION_REMOVE) {
        console.log("reducer")
        var newState: StoreData.TripVM = {
            ...state,
            locations: [
                ...state.locations.slice(0, action.locationId),
                ...state.locations.slice(action.locationId + 1)
            ]
        }

        return newState
    }

    return importImagesReducer(state, action)
}

function tripsReducer(state: Array<StoreData.TripVM>, action) {
    const actionType: string = action.type;

    console.log("actionType", actionType);
    if (_.startsWith(actionType, "TRIPS")) {
        //handle trips
        return action.trips;
    }
    else if (actionType == TRIP_ADD) {
        return [...state, action.trip];
    }
    else if (_.startsWith(actionType, "TRIP")) {
        //handle single trip
        var trip = _.find(state, (item) => item.tripId == action.tripId)

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