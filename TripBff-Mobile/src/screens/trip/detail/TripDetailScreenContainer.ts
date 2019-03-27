import { connect } from "react-redux";
import _ from "lodash";
import { TripDetailScreen } from "./TripDetailScreen";
import { addInfographicId } from '../export/actions';
import { StoreData } from "../../../store/Interfaces";
import { Props, IMapDispatchToProps } from "./TripDetailScreen"
import { updateLocationFeeling, 
  updateLocationActivity, 
  removeLocation, 
  addLocation } from "../../../store/Trip/operations";
import { updateTripDateRange, updateTripName } from "../../../store/Trip/operations";

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
  return {
    addInfographicId: (tripId, infographicId) => dispatch(addInfographicId(tripId, infographicId)),
    updateLocationFeeling: (tripId, dateIdx, locationId, feeling) => dispatch(updateLocationFeeling(tripId, dateIdx, locationId, feeling)),
    updateLocationActivity: (tripId, dateIdx, locationId, activity) => dispatch(updateLocationActivity(tripId, dateIdx, locationId, activity)),
    removeLocation: (tripId, dateIdx, locationId) => dispatch(removeLocation(tripId, dateIdx, locationId)),
    addLocation: (tripId, dateIdx, location) => dispatch(addLocation(tripId, dateIdx, location)),
    updateTripDateRange: (tripId, fromDate, toDate) => dispatch(updateTripDateRange(tripId, fromDate, toDate)),
    updateTripName: (tripId, tripName) => dispatch(updateTripName(tripId, tripName))
  };
};

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
  var { tripId } = ownProps.navigation.state.params;

  return {
      tripId: tripId
  };
};





const TripDetailScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TripDetailScreen);

export default TripDetailScreenContainer;
