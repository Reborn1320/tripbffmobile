import { 
  removeLocation as removeLocationAction, 
  addLocation as addLocationAction,
  updateLocationFeeling as updateLocationFeelingAction,
  updateLocationActivity as updateLocationActivityAction,
  updateTripDateRange as updateTripDateRangeAction,
  updateTripName as updateTripNameAction,
  updateLocationAddress as updateLocationAddressAction, 
  updateLocationImages} from "./actions";
import { ThunkResultBase } from "..";
import { Moment } from "moment";
import { StoreData, RawJsonData } from "../Interfaces";
import moment from "moment";

export function removeLocation(tripId: string, dateIdx: number, locationId: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    return extraArguments.tripApiService.delete(`trips/${tripId}/locations/${locationId}`)
      .then(res => {
        dispatch(removeLocationAction(tripId, dateIdx, locationId));
      })
      .catch(error => {
        console.log("removeLocation error", error);
      });
  };
}

export function addLocation(tripId: string, dateIdx: number, location: StoreData.LocationVM): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    
    var adddedLocation = {
        name: location.name,
        fromTime: location.fromTime,
        toTime: location.toTime,
        location: location.location,
        images: location.images
    };

    return extraArguments.api.post(`trips/${tripId}/locations/addLocation`, adddedLocation)
      .then(res => {
        if (res.data.isSucceed) {
          location.locationId = res.data.data;
          console.log('new added location id: ' + res.data.data);
          dispatch(addLocationAction(tripId, dateIdx, location));
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
      fromDate: fromDate, 
      toDate: toDate
    };
    return extraArguments.tripApiService.patch(`trips/${tripId}`, { data })
    .then((res) => {
        dispatch(updateTripDateRangeAction(tripId, data.fromDate, data.toDate));
    })
    .catch((err) => {
      console.log('error update trip date range api: ', err);
    });
  };
}

export function updateTripName(tripId: string, name: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    const data = { 
      name
    };
    return extraArguments.tripApiService.patch(`trips/${tripId}`, { data })
    .then((res) => {
        dispatch(updateTripNameAction(tripId, name));
    })
    .catch((err) => {
      console.log('error update trip name api: ', err);
    });
  };
}

export function updateLocationFeeling(tripId: string, dateIdx: number, locationId: string, feeling: StoreData.FeelingVM): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = {
      feelingId: feeling.feelingId
    };
    return extraArguments.tripApiService.patch(`/trips/${tripId}/locations/${locationId}/feeling`, { data })
    .then((res) => {
      dispatch(updateLocationFeelingAction(tripId, dateIdx, locationId, feeling));
    })
    .catch((err) => {
      console.log('error update location feeling: ', err);
    });
  };
}

export function updateLocationActivity(tripId: string, dateIdx: number, locationId: string, activity: StoreData.ActivityVM): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = {
      activityId: activity.activityId
    };
    return extraArguments.tripApiService.patch(`/trips/${tripId}/locations/${locationId}/activity`, { data })
    .then((res) => {
      dispatch(updateLocationActivityAction(tripId, dateIdx, locationId, activity));
    })
    .catch((err) => {
      console.log('error update location activity: ', err);
    });
  };
}

//todo: shouldn't depend on dateIdx
export function updateLocationAddress(tripId: string, dateIdx: number, locationId: string, location: RawJsonData.LocationAddressVM): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = {
      name: location.name,
      address: location.address,
      long: location.long,
      lat: location.lat
    };
    return extraArguments.tripApiService.patch(`/trips/${tripId}/locations/${locationId}/address`, { data })
    .then((res) => {
      dispatch(updateLocationAddressAction(tripId, dateIdx, locationId, location));
    })
    .catch((err) => {
      console.log('error update location activity: ', err);
    });
  };
}

export function deleteMultiLocationImages(tripId: string, locationId: string,
  imageIds: string[]): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = {
      imageIds
    };
    return extraArguments.tripApiService
    .delete(`/trips/${tripId}/locations/${locationId}/images`, { data })
    .then((res) => {
      const location: StoreData.ImportImageVM = res.data;
      dispatch(updateLocationImages(tripId, locationId, location));
    })
    .catch((err) => {
      console.log('error delete multiple location images: ', err);
    });
  };
}