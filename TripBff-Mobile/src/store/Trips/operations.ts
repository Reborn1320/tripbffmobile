import { ThunkResultBase } from "../../screens/_shared/LayoutContainer";
import { StoreData, RawJsonData } from "../Interfaces";
import moment from "moment";

export function fetchTrips(): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    return extraArguments.api.get("trips")
      .then(res => {
        var rawTripsVM: Array<RawJsonData.TripVM> = res.data;
        var trips: Array<StoreData.TripVM> = rawTripsVM.map(rawTrip => ({
          tripId: rawTrip.tripId,
          name: rawTrip.name,
          fromDate: moment(rawTrip.fromDate),
          toDate: moment(rawTrip.toDate),
          locations: rawTrip.locations,
          infographicId: rawTrip.infographicId,
        }));
        return trips;
      })
      .catch(error => {
        console.log("fetch trips error", error);
      });
  };
}