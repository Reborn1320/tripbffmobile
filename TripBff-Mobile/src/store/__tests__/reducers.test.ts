import reducer from "../reducers";
import { TRIP_ADD } from "../../screens/trip/create/actions";
import moment = require("moment");
import { StoreData } from "../Interfaces";

describe('trip reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}))
      // .toEqual({});
      .toMatchSnapshot();

  })

  it('should handle TRIP_ADD', () => {
    const startAction: { type: string, trip: StoreData.TripVM } = {
      type: TRIP_ADD,
      trip: {
        tripId: "tripId01",
        name: "name",
        fromDate: moment('2019-03-16T17:00:00.000Z'),
        toDate: moment('2019-03-23T16:59:59.999Z')
      }
    };
    var result = reducer(undefined, {});
    expect(reducer(result, startAction).trips).toMatchSnapshot();
  });


  it('should handle TRIPS_ADD', () => {
    const startAction = {
      type: "TRIPS_ADD",
      trips: [{
        tripId: "36f626c0-47cd-11e9-b7e2-efb95b29f029",
        name: "Ffggc 7f7",
        fromDate: moment("2019-03-16T17:00:00.000Z"),
        toDate: moment("2019-03-23T16:59:59.999Z"),
        locations: [{
          locationId: "c0ee8221-270e-41b9-beaa-9cbc11eb779d",
          location: {
            lat: 10.801314353942871,
            long: 106.64141845703125
          },
          fromTime: "2019-03-13T08:37:55.844Z",
          toTime: "2019-03-13T08:38:28.099Z",
          images: [{
            imageId: "829ba1a6-b9ee-4c09-8ee4-225b37c47111",
            url: "file:///storage/emulated/0/DCIM/Camera/20190313_153828.jpg",
            externalUrl: "",
            thumbnailExternalUrl: ""
          }, {
            imageId: "2ad22ba0-0434-4352-8d72-d048599dfbe7",
            url: "file:///storage/emulated/0/DCIM/Camera/20190313_153755.jpg",
            externalUrl: "",
            thumbnailExternalUrl: ""
          }],
          feeling: {},
          activity: {}
        }]
      }]
    };
    var result = reducer(undefined, {});
    expect(reducer(result, startAction).trips).toMatchSnapshot();
  });
})

