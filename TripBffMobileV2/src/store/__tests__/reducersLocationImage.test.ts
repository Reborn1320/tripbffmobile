import reducer from "../reducers";
import moment = require("moment");
import { StoreData } from "../Interfaces";

describe('location image reducer', () => {

  function createTrip() {
    const startAction = {
      type: "TRIPS_ADD",
      trips: [{
        tripId: "tripId01",
        name: "Ffggc 7f7",
        fromDate: moment("2019-03-13T17:00:00.000Z"),
        toDate: moment("2019-03-23T16:59:59.999Z"),
        locations: [{
          locationId: "locationId01",
          location: {
            lat: 10.801314353942871,
            long: 106.64141845703125
          },
          fromTime: "2019-03-13T08:37:55.844Z",
          toTime: "2019-03-13T08:38:28.099Z",
          images: [{
            imageId: "imageId01",
            url: "url",
            externalUrl: "",
            thumbnailExternalUrl: ""
          }, {
            imageId: "imageId02",
            url: "url",
            externalUrl: "",
            thumbnailExternalUrl: ""
          }],
          feeling: {},
          activity: {}
        }]
      }]
    };
    var result = reducer(undefined, {});
    return reducer(result, startAction);
  }

  it('should handle TRIP_LOCATION_IMAGE_FAVOR', () => {
    const startAction = {
      type: "TRIP_LOCATION_IMAGE_FAVOR",
      dateIdx: 1,
      tripId: "tripId01",
      locationId: "locationId01",
      imageId: "imageId02",
      isFavorite: true,
    };
    var result = createTrip();
    expect(reducer(result, startAction).trips).toMatchSnapshot();
  });
})

