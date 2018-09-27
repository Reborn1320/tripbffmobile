import { cloneDeep } from 'lodash';
import { BffStoreData, UserVM, TripVM, LocationVM } from "./Interfaces";
import importImagesReducer from "./screens/trip/import/reducers";
import homeScreenReducer from "./screens/home/reducer";
import ImportImageScreenData from "./fake_data";

const initState: BffStoreData = {
}

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

function userReducer(state = userInitState, action) {
    return state;
}

function tripReducer(state = tripsInitState, action) {
    return state;
}

export default function bffApp(state: BffStoreData = initState, action): BffStoreData {
    return {
        repo: homeScreenReducer(state.repo, action),
        user: userReducer(state.user, action),
        trips: tripReducer(state.trips, action)
    }
}