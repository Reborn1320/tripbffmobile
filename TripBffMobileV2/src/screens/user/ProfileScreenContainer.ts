import { connect } from "react-redux";
import _ from "lodash";
import { fetchTrips, deleteTrip, getCurrentMinimizedTrip } from "../../store/Trips/operations";
import { addTrips } from "../../store/Trips/actions";
import  ProfileScreen  from "./ProfileScreen";
import { StoreData } from "../../store/Interfaces";

const mapDispatchToProps = dispatch => {
  return {
    fetchTrips: (cancelToken: any) => dispatch(fetchTrips(cancelToken)),
    addTrips: (trips) => dispatch(addTrips(trips)),
    deleteTrip: (tripId) => dispatch(deleteTrip(tripId)),
    getCurrentMinimizedTrip: (tripId) => dispatch(getCurrentMinimizedTrip(tripId))
  };
};

const ProfileScreenContainer = connect(
  null,
  mapDispatchToProps
)(ProfileScreen);

export default ProfileScreenContainer;
