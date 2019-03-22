import { connect } from "react-redux";
import _ from "lodash";
import { TripDetailScreen } from "./TripDetailScreen";
import { addInfographicId } from '../export/actions';

const mapDispatchToProps = dispatch => {
  return {
    addInfographicId: (tripId, infographicId) => dispatch(addInfographicId(tripId, infographicId)),
  };
};

const TripDetailScreenContainer = connect(
  null,
  mapDispatchToProps
)(TripDetailScreen);

export default TripDetailScreenContainer;
