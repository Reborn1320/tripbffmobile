import {removeLocation as removeLocationAction } from "./actions";
import { ThunkResultBase } from "..";

export function removeLocation(tripId: string, locationId: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    return extraArguments.tripApiService.delete({ url: `trips/${tripId}/locations/${locationId}` })
      .then(res => {
        dispatch(removeLocationAction(tripId, locationId));
      })
      .catch(error => {
        console.log("removeLocation error", error);
      });
  };
}