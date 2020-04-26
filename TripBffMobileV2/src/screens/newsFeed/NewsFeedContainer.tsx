import { connect } from "react-redux";
import _ from "lodash";
import {
  fetchPublicTrips,
  getCurrentMinimizedTrip,
} from "../../store/Trips/operations";
import NewsFeedScreen from "./NewsFeedScreen";
import { clearAllDatasource } from "../../store/DataSource/actions";
import { clearPublicTrips } from "../../store/Trips/actions";

const mapDispatchToProps = dispatch => {
  return {
    fetchPublicTrips: (page: number, cancelToken: any) => dispatch(fetchPublicTrips(page, cancelToken)),
    clearPublicTrips: () => dispatch(clearPublicTrips()),
    getCurrentMinimizedTrip: tripId =>
      dispatch(getCurrentMinimizedTrip(tripId)),
    clearDatasource: () => dispatch(clearAllDatasource()),
  };
};

const NewsFeedScreenContainer = connect(
  null,
  mapDispatchToProps
)(NewsFeedScreen);

export default NewsFeedScreenContainer;
