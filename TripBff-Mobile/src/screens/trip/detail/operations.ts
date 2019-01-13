import { ThunkResultBase } from "../../_shared/LayoutContainer";
import {removeLocation as removeLocationAction } from "./actions";

export function removeLocation(tripId: string, locationId: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    return extraArguments.api.put(`trips/${tripId}/locations/${locationId}`)
      .then(res => {
        dispatch(removeLocationAction)
      })
      .catch(error => {
        console.log("removeLocation error", error);
      });
  };
}