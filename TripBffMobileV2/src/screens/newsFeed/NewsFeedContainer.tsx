import { connect } from "react-redux";
import _ from "lodash";
import {
  fetchPublicTrips,
  getCurrentMinimizedTrip,
} from "../../store/Trips/operations";
import { addPublicTrips } from "../../store/Trips/actions";
import NewsFeedScreen from "./NewsFeedScreen";
import { clearAllDatasource } from "../../store/DataSource/actions";

const mapDispatchToProps = dispatch => {
  return {
    fetchPublicTrips: (page: number, cancelToken: any) => dispatch(fetchPublicTrips(page, cancelToken)),
    addPublicTrips: trips => dispatch(addPublicTrips(trips)),
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
