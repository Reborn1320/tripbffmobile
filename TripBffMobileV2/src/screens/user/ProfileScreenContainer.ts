import { connect } from "react-redux";
import _ from "lodash";
import { loginUsingUserPass, loginUsingFacebookAccessToken } from "../../store/User/operations";
import { fetchTrips } from "../../store/Trips/operations";
import { addTrips } from "../../store/Trips/actions";
import { ProfileScreen } from "./ProfileScreen";
import { StoreData } from "../../store/Interfaces";


const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  return {
    userName: storeState.user.username,
    fullName: storeState.user.fullName,
    trips: storeState.trips
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginUsingUserPass: (email, password) => dispatch(loginUsingUserPass(email, password)),
    loginUsingFacebookAccessToken: (userId, accessToken) => dispatch(loginUsingFacebookAccessToken(userId, accessToken)),
    fetchTrips: () => dispatch(fetchTrips()),
    addTrips: (trips) => dispatch(addTrips(trips))
  };
};

const ProfileScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);

export default ProfileScreenContainer;
