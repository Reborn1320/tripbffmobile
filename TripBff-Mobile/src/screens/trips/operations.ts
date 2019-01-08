import { ThunkResultBase } from "../_shared/LayoutContainer";

export function fetchTrips(): ThunkResultBase {
  return async function(dispatch, getState, extraArguments): Promise<any> {

    return extraArguments.api.get("trips")
    .catch(error => {
      console.log("fetch trips error", error);
    });
  };
}