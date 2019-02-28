import { removeLocation as removeLocationAction } from "./actions";
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