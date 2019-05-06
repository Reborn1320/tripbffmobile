import { connect } from "react-redux";
import _ from "lodash";
import { TripEditScreen } from "./TripEditScreen";
import { addInfographicId } from "../../../store/Trip/actions";

// import { updateTripDateRange } from "../../../store/Trip/operations";

const mapStateToProps = (storeState, ownProps) => {
  const { tripId } = ownProps.navigation.state.params;
  //todo move to getter
  var trip = _.find(storeState.trips, (item) => item.tripId == tripId);
  return {
      trip
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // updateTripDateRange: (tripId, fromDate, toDate) => dispatch(updateTripDateRange(tripId, fromDate, toDate)),
    addInfographicId: (tripId, infographicId) => dispatch(addInfographicId(tripId, infographicId)),
  };
};

const TripEditScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TripEditScreen);

export default TripEditScreenContainer;
