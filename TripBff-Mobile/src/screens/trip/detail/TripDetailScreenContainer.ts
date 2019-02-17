import { connect } from "react-redux";
import _ from "lodash";
import { TripDetailScreen } from "./TripDetailScreen";
import { addInfographicId } from '../export/actions';

const mapStateToProps = (storeState, ownProps) => {
  const { tripId } = ownProps.navigation.state.params
  //todo move to getter
  var trip = _.find(storeState.trips, (item) => item.tripId == tripId)
  return {
      trip
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addInfographicId: (tripId, infographicId) => dispatch(addInfographicId(tripId, infographicId)),
  };
};

const TripDetailScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TripDetailScreen);

export default TripDetailScreenContainer;
