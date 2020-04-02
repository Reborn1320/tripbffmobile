import { connect } from "react-redux";
import _ from "lodash";
import { TripEditScreen } from "./TripEditScreen";
import { addInfographicId } from "../../../store/Trip/actions";
import { StoreData } from "../../../store/Interfaces";
import { fetchTrip } from "../../../store/Trip/operations";

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  const { tripId } = ownProps.navigation.state.params;
  return {
      tripId,
      trip: storeState.currentTrip && storeState.currentTrip.tripId == tripId ? storeState.currentTrip : undefined,
      userId: storeState.user.id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchTrip: (tripId, cancelToken) => dispatch(fetchTrip(tripId, cancelToken)),
    addInfographicId: (tripId, infographicId) => dispatch(addInfographicId(tripId, infographicId)),
  };
};

const TripEditScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TripEditScreen);

export default TripEditScreenContainer;
