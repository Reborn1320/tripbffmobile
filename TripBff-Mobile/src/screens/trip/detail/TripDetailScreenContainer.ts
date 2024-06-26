import { connect } from "react-redux";
import _ from "lodash";
import { TripDetailScreen } from "./TripDetailScreen";
import { StoreData } from "../../../store/Interfaces";
import { Props, IMapDispatchToProps } from "./TripDetailScreen"
import { addInfographicId } from "../../../store/Trip/actions";

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
  return {
    addInfographicId: (tripId, infographicId) => dispatch(addInfographicId(tripId, infographicId)),
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
