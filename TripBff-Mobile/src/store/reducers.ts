import _ from 'lodash';
import moment from "moment";
import { StoreData } from "./Interfaces";
import homeScreenReducer from "../screens/home/reducer";
import { TRIP_ADD } from '../screens/trip/create/actions';
import { AUTH_ADD_TOKEN } from './User/actions';
import { ADD_INFOGRAPHIC_ID } from '../screens/trip/export/actions';
import { LOCATION_REMOVE, 
         LOCATION_ADD,
         LOCATION_UPDATE_FEELING,
         LOCATION_UPDATE_ACTIVITY,
         TRIP_UPDATE_DATE_RANGE,
         TRIP_UPDATE_TRIP_NAME, 
         LOCATION_UPDATE_ADDRESS,
         LOCATION_UPDATE_HIGHLIGHT,
         LOCATION_UPDATE_DESCRIPTION } from './Trip/actions';
import { DataSource_GetAllFeeling, DataSource_GetAllActivity, DataSource_GetAllHighlight } from './DataSource/actions';
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

function getDateVms(fromDate, toDate, oldDateVms) {
    var dateVMs: StoreData.DateVM[] = [];
    const nDays = toDate.diff(fromDate, "days") + 1

    for (let idx = 0; idx < nDays; idx++) {

        var oldDateVM = oldDateVms.find(function(value, index) {
            var oldDate = moment(value.date).startOf('day');
            var date = moment(fromDate).add(idx, 'days').startOf('day');
            return  oldDate.isSame(date);
        });

        dateVMs.push({
            dateIdx: idx + 1,
            date: moment(fromDate.add(idx, 'days')),
            locationIds: oldDateVM ? oldDateVM.locationIds : [],
            locations: oldDateVM ? oldDateVM.locations : [],
        })
    }

    return dateVMs;  
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
            date: state.fromDate.clone().add(idx, 'days'),
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
        case LOCATION_UPDATE_ACTIVITY:
            return {
                ...state,
                activity: action.activity
            };
        case LOCATION_UPDATE_ADDRESS:
            return {
                ...state,
                name: action.location.name,
                location: {
                    address: action.location.address,
                    long: action.location.long,
                    lat: action.location.lat
                }
            };
        case LOCATION_UPDATE_HIGHLIGHT:
            return {
                ...state,
                likeItems: [...action.highlights]
            };
        case LOCATION_UPDATE_DESCRIPTION:
            return {
                ...state,
                description: action.description
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
                toDate: action.toDate,
                dates: getDateVms(action.fromDate.clone(), action.toDate.clone(), state.dates)
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

    if (_.startsWith(actionType, "TRIPS")) {
        //handle trips
        //todo clearly something wrong here
        return action.trips.map(trip => importSelectedLocations(trip, { locations: trip.locations }));
    }
    else if (actionType == TRIP_ADD) {
        return [...state, action.trip];
    }
    else if (_.startsWith(actionType, "TRIP")) {
        var newState = state.map(trip => trip.tripId == action.tripId ? tripReducer(trip, action) : trip);
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
        case DataSource_GetAllHighlight:
            return {
                ...state,
                highlights: action.highlights
            }
        default:
            return state;
    } 
}

//todo small refactor to move each reducer to files
export default function bffApp(state: StoreData.BffStoreData = initState, action): StoreData.BffStoreData {
    console.log('action :' + action.type);

    return {
        repo: homeScreenReducer(state.repo, action),
        user: userReducer(state.user, action),
        trips: tripsReducer(state.trips, action),
        dataSource: dataSourceReducer(state.dataSource, action)
    }
}