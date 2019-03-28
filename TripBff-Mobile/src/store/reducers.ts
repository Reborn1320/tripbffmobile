import _, { cloneDeep } from 'lodash';
import moment from "moment";
import { StoreData } from "./Interfaces";
import homeScreenReducer from "../screens/home/reducer";
import { TRIP_ADD } from '../screens/trip/create/actions';
import { AUTH_ADD_TOKEN } from './User/actions';
import { ADD_INFOGRAPHIC_ID } from '../screens/trip/export/actions';
import { LOCATION_REMOVE, 
         LOCATION_ADD,
         LOCATION_UPDATE_FEELING,
         LOCATION_UPDATE,
         LOCATION_UPDATE_ACTIVITY,
         TRIP_UPDATE_DATE_RANGE,
         TRIP_UPDATE_TRIP_NAME } from './Trip/actions';
import { DataSource_GetAllFeeling, DataSource_GetAllActivity } from './DataSource/actions';
import { stat } from 'fs';
import { IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS, IMPORT_UPLOADED_IMAGE } from "../screens/trip/import/actions";

const userInitState: StoreData.UserVM = {
    username: "asdf",
    lastName: "asdf",
    firstName: "asdf",
    fullName: "adffff",
    email: "asdf@gmail.com",
    token: "ASdf",
    fbToken: ""
}

const initState: StoreData.BffStoreData = {
    user: userInitState,
    dataSource: {},
    trips: [] 
}

function compareLocationsFromTime(first, second) {
    var order = 0,
        firstElementFromTime = moment(first.fromTime),
        secondElementFromTime = moment(second.fromTime);

    if (firstElementFromTime < secondElementFromTime) 
        order = -1
    else if (firstElementFromTime > secondElementFromTime)
        order =  1

    return order;
}

function importSelectedLocations(state: StoreData.TripVM, action) {
    const { locations } = action
    var dateVMs: StoreData.DateVM[] = [];
    const nDays = state.toDate.diff(state.fromDate, "days") + 1

    for (let idx = 0; idx < nDays; idx++) {
        var locationsOfDate = locations.filter(element => moment(element.fromTime).diff(state.fromDate, "days") == idx);

        dateVMs.push({
            dateIdx: idx + 1,
            date: moment(state.fromDate.add(idx, 'days')),
            locationIds: locationsOfDate.map(e => { return e.locationId }),
            locations: locationsOfDate.sort(compareLocationsFromTime).map(e => { return e })
        })
    }

    return {
        ...state,
        dates: dateVMs
    };
}

function userReducer(state, action) {
    if (action.type == AUTH_ADD_TOKEN) {
        return action.user;
    }

    return state;
}

function imageReducer(state: StoreData.ImportImageVM, action) {
    switch(action.type) {
        case IMPORT_UPLOADED_IMAGE:
            return {
                ...state,
                externalStorageId: action.externalStorageId
            }
        default: 
            return state;
    }
}

function locationReducer(state: StoreData.LocationVM, action) {
    switch(action.type) {
        case LOCATION_UPDATE_FEELING:
            return {
                ...state,
                feeling: action.feeling
            };        
        case LOCATION_UPDATE:
            return {
                ...state,
                locations: action.locations
            };        
        case LOCATION_UPDATE_ACTIVITY:
            return {
                ...state,
                activity: action.activity
            };
        //TODO: upload images
        //TODO: remove images
        default:
            return {
                ...state,
                images: state.images.map(item => {
                    return item.imageId == action.imageId ? imageReducer(item, action) : item;
                })
            };
    }    
}

function dateReducer(state: StoreData.DateVM, action) {
    switch(action.type) {
        case LOCATION_REMOVE:
            return {
                ...state,
                locations: state.locations.filter(item => item.locationId !== action.locationId),
                locationIds: state.locationIds.filter(l => l !== action.locationId)
            }    
        case LOCATION_ADD:
            var locations = [...state.locations, action.location];
            locations.sort(compareLocationsFromTime);

            return {
                ...state,
                locations: locations,
                locationIds: locations.map((e) => { return e.locationId })
            }     
        default:
            return {
                ...state,
                locations: state.locations.map(item => {
                    return item.locationId == action.locationId ? locationReducer(item, action) : item;
                })
        };
    }    
}


function tripReducer(state: StoreData.TripVM, action) {
    console.log('come here trip reducer: ' + JSON.stringify(action));

    switch(action.type) {
        case ADD_INFOGRAPHIC_ID: 
            return Object.assign({}, state, {
                infographicId: action.infographicId
              });              
        case IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS:
            return importSelectedLocations(state, action);        
        case TRIP_UPDATE_DATE_RANGE:
            return {
                ...state,
                fromDate: action.fromDate,
                toDate: action.toDate
            }
        case TRIP_UPDATE_TRIP_NAME:
            return {
                ...state,
                name: action.tripName
            }
        default: 
            return {
                ...state,
                dates: state.dates.map(item => {
                    return item.dateIdx == action.dateIdx ? dateReducer(item, action) : item;
                })
            }
    }    
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

function dataSourceReducer(state: StoreData.DataSourceVM = {}, action) {
    switch(action.type) {
        case DataSource_GetAllFeeling:
            return {
                ...state,
                feelings: action.feelings
            }
        case DataSource_GetAllActivity:
            return {
                ...state,
                activities: action.activities
            }
        default:
            return state;
    }
}

export default function bffApp(state: StoreData.BffStoreData = initState, action): StoreData.BffStoreData {
    return {
        repo: homeScreenReducer(state.repo, action),
        user: userReducer(state.user, action),
        trips: tripsReducer(state.trips, action),
        dataSource: dataSourceReducer(state.dataSource, action)
    }
}