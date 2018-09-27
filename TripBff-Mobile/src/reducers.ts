import { BffStoreData, UserVM } from "./Interfaces";
import importImagesReducer from "./screens/trip/import/reducers";
import homeScreenReducer from "./screens/home/reducer";

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

function userReducer(state = userInitState, action) {
    return state;
}

function tripReducer(state = [], action) {
    return state;
}

export default function bffApp(state: BffStoreData = initState, action): BffStoreData {
    return {
        repo: homeScreenReducer(state.repo, action),
        user: userReducer(state.user, action),
        trips: tripReducer(state.trips, action)
    }
}