import { StoreData, RawJsonData } from "../Interfaces";
import moment from "moment";
import { ThunkResultBase } from "..";

export function fetchTrips(): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    return extraArguments.tripApiService.get("trips")
      .then(res => {
        var rawTripsVM: Array<RawJsonData.TripVM> = res.data;
        var trips: Array<StoreData.TripVM> = rawTripsVM.map(rawTrip => ({
          tripId: rawTrip.tripId,
          name: rawTrip.name,
          fromDate: moment(rawTrip.fromDate),
          toDate: moment(rawTrip.toDate),
          locations: rawTrip.locations,
          dates: [], //todo: just to by-pass error
          infographicId: rawTrip.infographicId,
        }));
        return trips;
      })
      .catch(error => {
        console.log("fetch trips error", error);
      });
  };
}

// export function fetchTrip(tripId: string): ThunkResultBase {
//   return async function (dispatch, getState, extraArguments): Promise<any> {

//     return extraArguments.tripApiService.get(`trips/${tripId}`)
//       .then(res => {
//         var rawTrip: RawJsonData.TripVM = res.data;
//         var trip: StoreData.TripVM = {
//           tripId: rawTrip.tripId,
//           name: rawTrip.name,
//           fromDate: moment(rawTrip.fromDate),
//           toDate: moment(rawTrip.toDate),
//           locations: rawTrip.locations,
//           infographicId: rawTrip.infographicId,
//         };
//         return trip;
//       })
//       .catch(error => {
//         console.log("fetch trip error", error);
//       });
//   };
// }

// export function fetchTripLocations(tripId: string): ThunkResultBase {
//   return async function (dispatch, getState, extraArguments): Promise<any> {

//     return extraArguments.tripApiService.get(`trips/${tripId}/locations`)
//       .then(res => {
//         var rawLocations: Array<RawJsonData.LocationVM> = res.data.locations;
//         var locations: Array<StoreData.LocationVM> = rawLocations.map(rawLocation => {
//           return {
//             locationId: rawLocation.locationId,
//             location: rawLocation.location,
//             fromTime: moment(rawLocation.fromTime),
//             toTime: moment(rawLocation.toTime),
//             images: rawLocation.images,
//             feeling: rawLocation.feeling,
//             activity: rawLocation.activity
//           }
//         });

//         return locations;
//       })
//       .catch(error => {
//         console.log("fetch trip error", error);
//       });
//   };
// }