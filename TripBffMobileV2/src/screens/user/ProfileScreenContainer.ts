import { connect } from "react-redux";
import _ from "lodash";
import { fetchTrips, deleteTrip } from "../../store/Trips/operations";
import { addTrips } from "../../store/Trips/actions";
import { ProfileScreen } from "./ProfileScreen";
import { StoreData } from "../../store/Interfaces";


const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {

  return {
    userName: storeState.user.username,
    fullName: storeState.user.fullName,
    trips: storeState.trips.filter(item => item.isDeleted != true)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchTrips: () => dispatch(fetchTrips()),
    addTrips: (trips) => dispatch(addTrips(trips)),
    deleteTrip: (tripId) => dispatch(deleteTrip(tripId))
  };
};

const ProfileScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);

export default ProfileScreenContainer;
