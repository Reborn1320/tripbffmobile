import { connect } from "react-redux";
import _ from "lodash";
import { loginUsingUserPass } from "./User/operations";
import { fetchTrips } from "../../trips/operations";
import { ProfileScreen } from "./ProfileScreen";

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    loginUsingUserPass: (email, password) =>
      dispatch(loginUsingUserPass(email, password)),
    fetchTrips: () => dispatch(fetchTrips())
  };
};

const ProfileScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);

export default ProfileScreenContainer;
