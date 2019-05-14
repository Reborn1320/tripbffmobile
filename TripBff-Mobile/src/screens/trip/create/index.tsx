import React, { Component } from "react";
import { Keyboard } from "react-native";
import { Container, Content, Footer } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import { connect } from "react-redux";
import { Moment } from "moment";
import { PropsBase } from "../../_shared/LayoutContainer";
import { TripCreationForm } from "./TripCreationForm";
import { createTrip as createTripAsync, updateTrip } from "../../../store/Trip/operations";
import AppFooter from "../../shared/AppFooter"
import { NavigationConstants } from "../../_shared/ScreenConstants";

export interface Props extends IMapDispatchToProps, PropsBase {
  user: StoreData.UserVM
}

interface IMapDispatchToProps {
  createTripAsync: (name: string, fromDate: Moment, toDate: Moment) => Promise<string>;
  updateTrip: (tripId: string, name: string, fromDate: Moment, toDate: Moment) => Promise<any>;
}

class TripCreation extends Component<Props, any> {
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: 'Create new trip'
    };
  };
  
  constructor(props) {
    super(props);

    this.state = {
      isHideAppFooter: false
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  private _keyboardDidShow = () => {
    this.setState({
      isHideAppFooter: true
    });
  }

  private _keyboardDidHide = () => {
    this.setState({
      isHideAppFooter: false
    });
  }

  private _onCreatedOrUpdatedHandler = (tripId, tripName) => {
    this.props.navigation.navigate(NavigationConstants.Screens.TripImport, {
        tripId: tripId,
        otherParam: tripName });
  }

  render() {
    return (
      <Container>
        <Content>
          <TripCreationForm createTrip={this.props.createTripAsync} 
                            updateTrip={this.props.updateTrip}
                            onTripCreatedUpdatedHandler={this._onCreatedOrUpdatedHandler} />
        </Content>
        {
          this.state.isHideAppFooter ||
            <Footer>
              <AppFooter navigation={this.props.navigation} activeScreen={NavigationConstants.Screens.TripCreation} />
            </Footer>
        }
      </Container>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    createTripAsync: (name, fromDate, toDate) => dispatch(createTripAsync(name, fromDate, toDate)),
    updateTrip: (tripId, name, fromDate, toDate) => dispatch(updateTrip(tripId, name, fromDate, toDate))
  }
};

const TripCreationScreen = connect(null, mapDispatchToProps)(TripCreation);

export default TripCreationScreen;
