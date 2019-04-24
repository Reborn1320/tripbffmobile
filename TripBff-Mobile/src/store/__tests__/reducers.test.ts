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
        fromDate: moment('2019-01-01'),
        toDate: moment('2019-01-10')
      }
    };
    var result = reducer(undefined, {});
    expect(reducer(result, startAction).trips).toMatchSnapshot();
  });
})

