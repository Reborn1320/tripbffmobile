import { removeLocation as removeLocationAction } from "./actions";
import { ThunkResultBase } from "..";
import { Moment } from "moment";

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
      console.log('trip id: ', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('error create trip api: ', err);
    });
  };
}
