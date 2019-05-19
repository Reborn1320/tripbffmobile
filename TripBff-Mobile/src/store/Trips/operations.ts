import { StoreData, RawJsonData } from "../Interfaces";
import moment from "moment";
import { ThunkResultBase } from "..";

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
        }));
        return trips;
      })
      .catch(error => {
        console.log("fetch trips error", error);
      });
  };
}