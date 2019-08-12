import React, { Component } from "react";
import { Container, Content, View} from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import { connect } from "react-redux";
import moment, { Moment } from "moment";
import { PropsBase } from "../../_shared/LayoutContainer";
import TripCreationForm  from "./TripCreationForm";
import { updateTrip } from "../../../store/Trip/operations";
import { withNamespaces } from "react-i18next";

export interface Props extends IMapDispatchToProps, PropsBase {
  user: StoreData.UserVM,
  tripId: string,
  tripName: string,
  tripFromDate?: moment.Moment,
  tripToDate?: moment.Moment
}

interface IMapDispatchToProps {
  updateTrip: (tripId: string, name: string, fromDate: Moment, toDate: Moment) => Promise<any>;
}

interface State {
}

class TripEditBasic extends Component<Props, State> {

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title:  screenProps.t('create:screen_header_edit_title'),
      headerRight: (<View></View>)
    };
  };    

  private _onCreatedOrUpdatedHandler = (tripId) => {
    this.props.navigation.goBack();
  }

  render() {
    
    return (
      <Container>
        <Content>
          <TripCreationForm
                tripId={this.props.tripId}
                tripName={this.props.tripName}
                tripFromDate={this.props.tripFromDate}
                tripToDate={this.props.tripToDate}
                updateTrip={this.props.updateTrip}
                onTripCreatedUpdatedHandler={this._onCreatedOrUpdatedHandler}
                titleButton={"action:save"}
                navigation={this.props.navigation} />
        </Content>        
      </Container>
    );
  }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
    var trip = storeState.currentTrip;
    
    return {
        tripId: trip.tripId,
        tripName: trip.name,
        tripFromDate: trip.fromDate,
        tripToDate: trip.toDate
    };
};

const mapDispatchToProps = dispatch => {
  return {
    updateTrip: (tripId, name, fromDate, toDate) => dispatch(updateTrip(tripId, name, fromDate, toDate))
  }
};

const TripEditBasicScreen = connect(mapStateToProps, mapDispatchToProps)(TripEditBasic);

export default withNamespaces(['action', 'create'])(TripEditBasicScreen);
