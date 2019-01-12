import { connect } from "react-redux";
import _ from "lodash";
import { loginUsingUserPass } from "../../store/User/operations";
import { fetchTrips } from "../trips/operations";
import { addTrips } from "../trips/actions";
import { ProfileScreen } from "./ProfileScreen";

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    loginUsingUserPass: (email, password) => dispatch(loginUsingUserPass(email, password)),
    fetchTrips: () => dispatch(fetchTrips()),
    addTrips: (trips) => dispatch(addTrips(trips))
  };
};

const ProfileScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);

export default ProfileScreenContainer;
