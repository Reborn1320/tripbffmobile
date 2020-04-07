import React, { Component } from "react";
import {
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
import { getCancelToken } from "../../_function/commonFunc";
import { withNamespaces } from "react-i18next";
import { PropsBase } from "../_shared/LayoutContainer";
import Flurry from 'react-native-flurry-sdk';
import { connect } from "react-redux";

interface IMapDispatchToProps extends PropsBase {
  fetchPublicTrips: (page: number, cancelToken: any) => Promise<any>;
  addPublicTrips: (trips: Array<StoreData.TripVM>) => void;
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

class NewsFeedScreenComponent extends Component<Props, State> {
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
    Flurry.logEvent('NewsFeed', null, true);
    let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
    this._cancelToken = cancelToken;
    this._cancelRequest = cancelRequest;

    this._refreshTrips();
  }

  componentWillUnmount() {
    this._cancelRequest("Operation canceled by the user.");
    Flurry.endTimedEvent('NewsFeed');
  }  

  private _refreshTrips = () => {
    this.props.fetchPublicTrips(0, this._cancelToken).then(trips => {
      this.props.addPublicTrips(trips);

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

  private _handleTripItemClick = (tripId: string, canContribute: boolean, createdById: string) => {   
    this.props.navigation.navigate(NavigationConstants.Screens.TripEdit, {
      tripId: tripId,
      canContribute: canContribute,
      createdById: createdById,
      onGoBackProfile: canContribute ? this._handleUpdatedTripGoBack : undefined,
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
                trips={this.props.trips}
                handleClick={this._handleTripItemClick}
              />          
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  return {
    trips: storeState.publicTrips
  };
};

const NewsFeedScreen = connect(
  mapStateToProps,
  null
)(NewsFeedScreenComponent);

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
