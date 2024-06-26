import { StoreData, RawJsonData } from "../Interfaces";
import moment from "moment";
import { ThunkResultBase } from "..";
import { deleteTrip as deleteTripAction, addPublicTrips } from "./actions";
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
          fromDate: moment(rawTrip.fromDate).local(),
          toDate: moment(rawTrip.toDate).local(),
          locationImages: rawTrip.locationImages,
          isDeleted: rawTrip.isDeleted,
          createdById: rawTrip.createdById,
          isPublic: rawTrip.isPublic,
          canContribute: rawTrip.canContribute,
          createdDate: rawTrip.createdDate ? moment(rawTrip.createdDate).local() : null
        }));
        return trips;
      })
      .catch(error => {
        console.log("fetch trips error", error);
      });
  };
}

export function fetchPublicTrips(page: number, cancelToken: CancelToken): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    var args = {
      config: {
        params: {
          page: page
        },        
        cancelToken: cancelToken
      }
    }

    return extraArguments.tripApiService.get("/newsFeed/trips", args)
      .then(res => {
        var rawTripsVM: Array<RawJsonData.MinimizedTripVM> = res.data;
        var trips: Array<StoreData.MinimizedTripVM> = rawTripsVM.map(rawTrip => ({
          tripId: rawTrip.tripId,
          name: rawTrip.name,
          fromDate: moment(rawTrip.fromDate).local(),
          toDate: moment(rawTrip.toDate).local(),
          locationImages: rawTrip.locationImages,
          isDeleted: rawTrip.isDeleted,
          createdById: rawTrip.createdById,
          isPublic: rawTrip.isPublic,
          canContribute: rawTrip.canContribute,
          createdDate: rawTrip.createdDate ? moment(rawTrip.createdDate).local() : null
        }));
        //console.log('public trips: ' + JSON.stringify(trips));
        dispatch(addPublicTrips(trips));
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
      let isLastTripDeleted = getState().trips && getState().trips.length == 1; 
      dispatch(deleteTripAction(tripId));
      return isLastTripDeleted;
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
        var rawTripsVM: RawJsonData.MinimizedTripVM = res.data;
        dispatch(getCurrentMinimizedTripAction(res.data));
      })
      .catch(error => {
        console.log("fetch minimized trips error", error);
      });
  };
}