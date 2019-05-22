import reducer from "../reducers";
import moment = require("moment");
import { StoreData } from "../Interfaces";

describe('stress test reducer', () => {

  function createTrip() {
    const startAction = {
      type: "TRIPS_ADD",
      trips: []
    };

    for (let tripIdx = 0; tripIdx < 10; tripIdx++) {
      var trip = {
        tripId: "tripId" + tripIdx,
        name: "Ffggc 7f7",
        fromDate: moment("2019-03-13T17:00:00.000Z"),
        toDate: moment("2019-03-24T16:59:59.999Z"),
        locations: []
      };

      for (let dateIdx = 0; dateIdx < 10; dateIdx++) {

        for (let locationIdx = 0; locationIdx < 10; locationIdx++) {
          var location = {
            locationId: "locationId" + (dateIdx * 10) + locationIdx,
            location: {
              lat: 10.801314353942871,
              long: 106.64141845703125
            },
            fromTime: "2019-03-" + (13 + dateIdx) + "T08:37:55.844Z",
            toTime: "2019-03-" + (13 + dateIdx) + "T08:38:28.099Z",
            images: [],
            feeling: {},
            activity: {}
          }

          for (let imageIdx = 0; imageIdx < 10; imageIdx++) {
            var img = {
              imageId: "imageId" + imageIdx,
              url: "url",
              externalUrl: "",
              thumbnailExternalUrl: ""
            }
            location.images.push(img);
          }

          trip.locations.push(location);
        }
      }


      startAction.trips.push(trip);
    }
    var result = reducer(undefined, {});
    return reducer(result, startAction);
  }

  it('should handle 1000 images fast fast', () => {
    const startAction = {
      type: "TRIP_LOCATION_IMAGE_FAVOR",
      tripId: "tripId7",
      dateIdx: 7,
      locationId: "locationId707",
      imageId: "imageId7",
      isFavorite: true,
    };
    var result = createTrip();

    const now = moment();

    const r2 = reducer(result, startAction);

    const milliSec = moment.duration(moment().diff(now)).asMilliseconds();
    console.log(`executed ${milliSec} milli secs`);
    expect(milliSec).toBeLessThan(1000);
    // expect(r2).toMatchSnapshot();
  });
})

