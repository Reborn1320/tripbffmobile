import _ from 'lodash';
import moment, { Moment } from "moment";
import { StoreData } from "./Interfaces";
import { TRIP_ADD } from '../screens/trip/create/actions';
import { AUTH_ADD_TOKEN } from './User/actions';
import { LOCATION_REMOVE, 
         LOCATION_ADD,
         LOCATION_UPDATE_FEELING,
         LOCATION_UPDATE_ACTIVITY,
         TRIP_UPDATE_DATE_RANGE,
         TRIP_UPDATE_TRIP_NAME, 
         LOCATION_UPDATE_ADDRESS,
         TripActions,
         LocationActions,
         LOCATION_UPDATE_IMAGES,
         LOCATION_UPDATE_HIGHLIGHT,
         LOCATION_UPDATE_DESCRIPTION,
         ADD_INFOGRAPHIC_ID,
         IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS,
         ImageActions,
         TRIP_UPDATE
} from './Trip/actions';
import { DataSource_GetAllFeeling, DataSource_GetAllActivity, DataSource_GetAllHighlight } from './DataSource/actions';
import { AppStateIOS } from 'react-native';

const userInitState: StoreData.UserVM = {
    username: "asdf",
    lastName: "asdf",
    firstName: "asdf",
    fullName: "adffff",
    email: "asdf@gmail.com",
    token: "ASdf"
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

function getDatesProperty(fromDate: Moment, toDate: Moment, locations: StoreData.LocationVM[]) {
    var dateVMs: StoreData.DateVM[] = [];
    const nDays = toDate.diff(fromDate, "days") + 1

    for (let idx = 0; idx < nDays; idx++) {
        var locationsOfDate = locations.filter(element => moment(element.fromTime).diff(fromDate, "days") == idx);

        dateVMs.push({
            dateIdx: idx + 1,
            date: fromDate.clone().add(idx, 'days'),
            locationIds: locationsOfDate.map(e => { return e.locationId }),
            locations: locationsOfDate.sort(compareLocationsFromTime).map(e => { return e })
        })
    }

    return dateVMs;
}

function userReducer(state, action) {
    if (action.type == AUTH_ADD_TOKEN) {
        return action.user;
    }

    return state;
}

function imageReducer(state: StoreData.ImportImageVM, action: ImageActions) {
    console.log('     + location image reducer: ', action.type);

    switch(action.type) {
        case "TRIP_LOCATION_IMAGE_UPLOAD":
            return {
                ...state,
                externalStorageId: action.externalStorageId,
                thumbnailExternalUrl: action.thumbnailExternalUrl
            }
        case "TRIP_LOCATION_IMAGE_FAVOR":
            return {
                ...state,
                isFavorite: action.isFavorite
            }
        // case "TRIP_LOCATION_IMAGE_PATCH":
        //     let newState = state;
        //     if (action.externalUrl) newState.externalUrl = action.externalUrl;
        //     if (action.thumbnailExternalUrl) newState.thumbnailExternalUrl = action.thumbnailExternalUrl;
        //     if (action.externalStorageId) newState.externalStorageId = action.externalStorageId;
        //     return newState;
        default: 
            return state;
    }
}

function locationReducer(state: StoreData.LocationVM, action: LocationActions) {
    console.log('   + location reducer: ', action.type);
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
        case "TRIP_LOCATION_IMAGE_ADD": 
            const newImage = {
                imageId: action.imageId,
                url: action.url,
                time: action.time,
                isFavorite: false,
            }
            //todo: sorting
            return {
                ...state,
                images: [...state.images, newImage ]
            };
        //TODO: upload images
        case LOCATION_UPDATE_IMAGES:
            console.log("LOCATION_UPDATE_IMAGES", action.locationImages.length)
            return {
                ...state,
                images: action.locationImages
            }
        default:
            if (action.type.startsWith("TRIP_LOCATION_IMAGE")) {
                return {
                    ...state,
                    images: state.images.map(item => {
                        return item.imageId == (action as any).imageId ? imageReducer(item, action) : item;
                    })
                };
            }

            console.error("unhandled action", action.type);
            return state;
    }    
}

//date + locations reducer
function dateReducer(state: StoreData.DateVM, action) {
    console.log(' + date reducer: ', action.type);
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

function tripReducer(state: StoreData.TripVM, action: TripActions) {
    console.log('trip reducer: ', action.type);

    switch(action.type) {
        case ADD_INFOGRAPHIC_ID: 
            return Object.assign({}, state, {
                infographicId: action.infographicId
              });              
        case IMPORT_IMAGE_IMPORT_SELECTED_LOCATIONS:
            const { locations } = action;
            const mappedLocations: StoreData.LocationVM[] = locations.map(loc => ({
                ...loc,
                images: loc.images.map(im => ({
                    ...im,
                    externalUrl: "",
                    thumbnailExternalUrl: "",
                    isFavorite: false,
                }))

            }));
            
            return {
                ...state,
                locations, //todo: remove this property
                dates: getDatesProperty(state.fromDate, state.toDate, mappedLocations)
            }
        case TRIP_UPDATE_DATE_RANGE:
            return {
                ...state,
                fromDate: action.fromDate,
                toDate: action.toDate,
                dates: getDatesProperty(action.fromDate, action.toDate, action.locations)
            }
        case TRIP_UPDATE_TRIP_NAME:
            return {
                ...state,
                name: action.tripName
            }
        case TRIP_UPDATE:
            return {
                ...state,
                name: action.name,
                fromDate: action.fromDate,
                toDate: action.toDate,
                dates: getDatesProperty(action.fromDate, action.toDate, [])
            };        
        default: 
        {
            //todo should start with TRIP_LOCATION
            if (action.type.startsWith("TRIP")) {
                return {
                    ...state,
                    dates: state.dates.map(item => {
                        return item.dateIdx == action.dateIdx ? dateReducer(item, action) : item;
                    })
                }
            }

            console.error("unhandled action", action.type);
            return state;
        }
        
    }    
}

function tripsReducer(state: Array<StoreData.TripVM>, action) {
    const actionType: string = action.type;

    if (_.startsWith(actionType, "TRIPS")) {
        //handle trips
        return action.trips.map(trip => {
            return {
                ...trip,
                dates: getDatesProperty(trip.fromDate, trip.toDate, trip.locations)
            }
        });
    }
    else if (actionType == TRIP_ADD) {
        var trip = {
            ...action.trip,
            dates: getDatesProperty(action.trip.fromDate, action.trip.toDate, [])
        }
        return [...state, trip];
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

    // const now = moment();
    const newState =  {
        user: userReducer(state.user, action),
        trips: tripsReducer(state.trips, action),
        //todo trips shouldn't handle too much things in here!!!!!
        //todo: should it be trip, location, in respect to each page ?
        dataSource: dataSourceReducer(state.dataSource, action)
    }

    // console.info(`executed ${moment.duration(moment().diff(now)).asMilliseconds()} milliseconds`);
    return newState;
}