import { removeLocation as removeLocationAction, addLocation as addLocationAction } from "./actions";
import { ThunkResultBase } from "..";
import { Moment } from "moment";
import { RawJsonData, StoreData } from "../Interfaces";
import moment from "moment";

export function removeLocation(tripId: string, locationId: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    return extraArguments.tripApiService.delete(`trips/${tripId}/locations/${locationId}`)
      .then(res => {
        dispatch(removeLocationAction(tripId, locationId));
      })
      .catch(error => {
        console.log("removeLocation error", error);
      });
  };
}

export function addLocation(tripId: string, location: StoreData.LocationVM): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    
    var adddedLocation = {
        fromTime: location.fromTime,
        toTime: location.toTime,
        location: location.location,
        images: location.images
    };

    return extraArguments.api.post(`trips/${tripId}/locations/addLocation`, adddedLocation)
      .then(res => {
        //console.log('added location result: ' + JSON.stringify(res));

        if (res.data.isSucceed) {
          location.locationId = res.data.data;
          console.log('new added location id: ' + res.data.data);
          dispatch(addLocationAction(tripId, location));
        }
        else if (res.data.errors.length > 0) {
          throw new Error(res.data.errors[0]);
        }
        else {
          throw new Error('Get error when add new location!');
        }
      })
      .catch(error => {
        console.log("add location error", JSON.stringify(error));
      });    
  };
}

export function createTrip(name: string, fromDate: Moment, toDate: Moment): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    var data = {
      name, fromDate, toDate
    }
    return extraArguments.tripApiService.post('/trips', { data })
    .then((res) => {
      const tripId: string = res.data;
      console.log('trip id: ', tripId);
      return tripId;
    })
    .catch((err) => {
      console.log('error create trip api: ', err);
    });
  };
}

export function updateTripDateRange(tripId: string, fromDate: Moment, toDate: Moment): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    const data = { 
      fromDate: fromDate.startOf("day"), 
      toDate: toDate.endOf("day")
    };
    return extraArguments.tripApiService.patch(`trips/${tripId}`, { data })
    .then((res) => {
      return convertTripFromRaw(res.data);
    })
    .catch((err) => {
      console.log('error update trip date range api: ', err);
    });
  };
}

function convertTripFromRaw(rawTrip: RawJsonData.TripVM): StoreData.TripVM {
  var trip: StoreData.TripVM = {
    tripId: rawTrip.tripId,
    name: rawTrip.name,
    fromDate: moment(rawTrip.fromDate),
    toDate: moment(rawTrip.toDate),
    locations: rawTrip.locations,
    infographicId: rawTrip.infographicId,
  };
  return trip;
}