import { StoreData, RawJsonData } from "../Interfaces";
import moment from "moment";
import { ThunkResultBase } from "..";
import { deleteTrip as deleteTripAction } from "./actions";
import {  CancelToken } from "axios";
import { getCurrentMinimizedTrip as getCurrentMinimizedTripAction } from "./actions";

export function fetchTrips(cancelToken: CancelToken): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    var args = {
      data: {
        cancelToken: cancelToken
      }
    }

    return extraArguments.tripApiService.get("trips", args)
      .then(res => {
        var rawTripsVM: Array<RawJsonData.MinimizedTripVM> = res.data;
        var trips: Array<StoreData.MinimizedTripVM> = rawTripsVM.map(rawTrip => ({
          tripId: rawTrip.tripId,
          name: rawTrip.name,
          fromDate: moment(rawTrip.fromDate),
          toDate: moment(rawTrip.toDate),
          locationImages: rawTrip.locationImages,
          isDeleted: rawTrip.isDeleted
        }));
        return trips;
      })
      .catch(error => {
        console.log("fetch trips error", error);
      });
  };
}

export function deleteTrip(tripId: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    return extraArguments.tripApiService.delete(`trips/${tripId}`)
    .then((res) => {
        dispatch(deleteTripAction(tripId));
    })
    .catch((err) => {
      console.log('error delete trip api: ', err);
    });
  };
}

export function getCurrentMinimizedTrip(tripId: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    return extraArguments.tripApiService.get(`/trips/minimized/${tripId}`)
      .then(res => {
        dispatch(getCurrentMinimizedTripAction(res.data));
      })
      .catch(error => {
        console.log("fetch trips error", error);
      });
  };
}