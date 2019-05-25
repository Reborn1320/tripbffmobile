import { StoreData, RawJsonData } from "../Interfaces";
import moment from "moment";
import { ThunkResultBase } from "..";
import { deleteTrip as deleteTripAction } from "./actions";

export function fetchTrips(): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    return extraArguments.tripApiService.get("trips")
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