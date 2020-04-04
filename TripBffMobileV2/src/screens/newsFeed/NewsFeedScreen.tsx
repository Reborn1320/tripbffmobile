import React, { Component } from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Container, Content, View } from "native-base";
import _ from "lodash";
import Loading from "../../_atoms/Loading/Loading";
import TripsComponent from "../../_organisms/Trips/TripsList/TripsComponent";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { StoreData } from "../../store/Interfaces";
import { NavigationScreenProp } from "react-navigation";
import UserDetails from "../../_organisms/User/UserDetails";
import { getCancelToken } from "../../_function/commonFunc";
import ConfirmationModal from "../../_molecules/ConfirmationModal";
import TripsEmptyComponent from "../../_organisms/Trips/TripsList/TripsEmptyComponent";
import { withNamespaces } from "react-i18next";
import { PropsBase } from "../_shared/LayoutContainer";
import Flurry from 'react-native-flurry-sdk';

interface IMapDispatchToProps extends PropsBase {
  fetchTrips: (cancelToken: any) => Promise<any>;
  addTrips: (trips: Array<StoreData.TripVM>) => void;
  deleteTrip: (tripId: string) => Promise<boolean>;
  getCurrentMinimizedTrip: (tripId: string) => void;
  clearDatasource: () => void;
}

export interface Props extends IMapDispatchToProps {
  navigation: NavigationScreenProp<any, any>;

  userName: string;
  fullName: string;

  trips: StoreData.MinimizedTripVM[];
}

interface State {
  isLoaded: boolean;
  loadingMessage: string;
  UIState: UIState;
  isOpenDeleteConfirmModal: boolean;
  deletedTripId: string;
  refreshing: boolean;
}

type UIState = "LOGIN" | "LOADING_TRIP" | "NORMAL";

class NewsFeedScreen extends Component<Props, State> {
  _cancelRequest;
  _cancelToken;

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: true,
      loadingMessage: this.props.t("profile:loading_trips_message"),
      UIState: "LOADING_TRIP",
      isOpenDeleteConfirmModal: false,
      deletedTripId: "",
      refreshing: false,
    };
  }

 componentDidMount() {
    Flurry.logEvent('Profile', null, true);
    let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
    this._cancelToken = cancelToken;
    this._cancelRequest = cancelRequest;

    this._refreshTrips();
  }

  componentWillUnmount() {
    this._cancelRequest("Operation canceled by the user.");
    Flurry.endTimedEvent('Profile');
  }  

  private _refreshTrips = () => {
    this.props.fetchTrips(this._cancelToken).then(trips => {
      this.props.addTrips(trips);

      if (this.state.refreshing) this.props.clearDatasource();

      this.setState({
        isLoaded: false,
        loadingMessage: "",
        UIState: "NORMAL",
        refreshing: false,
      });
    });
  };

  private _handleUpdatedTripGoBack = tripId => {
    this.props.getCurrentMinimizedTrip(tripId);
  };  

  private _handleTripItemClick = (tripId: string, canContribute: boolean) => {   
    this.props.navigation.navigate(NavigationConstants.Screens.TripEdit, {
      tripId: tripId,
      canContribute: canContribute,
      onGoBackProfile: this._handleUpdatedTripGoBack,
    });
  };

  private _handleShareBtnClick = tripId => {
    this.props.navigation.navigate(
      NavigationConstants.Screens.TripsInfographicPreivew,
      {
        tripId: tripId,
        onGoBackProfile: this._refreshTrips,
        isFromProfile: true,
      }
    );
  };

  private _handleDeleteTrip = tripId => {
    this.setState({
      isOpenDeleteConfirmModal: true,
      deletedTripId: tripId,
    });
  };

  private _onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoaded: true,
    });
    this._refreshTrips();
  };

  render() {
    const { isLoaded, refreshing } = this.state;
    const { t } = this.props;

    return (
      <Container>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={{ flex: 1 }}>            
            {isLoaded && !refreshing && (
              <Loading message={this.state.loadingMessage} />
            )}
            
            <TripsComponent
                handleClick={this._handleTripItemClick}
                handleShareClick={this._handleShareBtnClick}
                handleDeleteTrip={this._handleDeleteTrip}
              />          
          </View>
        </Content>
      </Container>
    );
  }
}

export default withNamespaces(["profile"])(NewsFeedScreen);

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
  },
  settingButtonContainer: {
    marginRight: 15,
  },
  settingIcon: {
    fontSize: 24,
  },
});
