import * as React from "react";
import { View, Text, Button, H2 } from "native-base";
import { StyleSheet, ViewStyle, ActivityIndicator } from "react-native";
import { connectStyle } from 'native-base';
import MapboxGL from '@react-native-mapbox-gl/maps';
MapboxGL.setAccessToken('pk.eyJ1IjoidHJpcGJmZiIsImEiOiJjanFtZHA3b2cxNXhmNDJvMm5tNHR4bTFpIn0.QKKFlCG0G5sEHIss1n-A8g');
import SearchLocation from '../../_molecules/Trip/SearchLocationComponent';
import ActionModal from "../../_molecules/ActionModal";
import { PropsBase } from "../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";
import Flurry from 'react-native-flurry-sdk';

export interface Props extends PropsBase {
  isVisible: boolean;
  long: number,
  lat: number
  confirmHandler: (name, address, long, lat) => void;
  cancelHandler?: () => void;
}

interface State {
  name: string,
  address: string,
  long: number,
  lat: number,
  isLoading: boolean
}

class LocationAddressModalComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      address: "",
      long: this.props.long,
      lat: this.props.lat,
      isLoading: true
    }
  }  

  private _selectedLocationHandler = (name, address, long, lat) => {
    this.setState({
      name: name,
      address: address,
      long: long,
      lat: lat
    });
  }

  _deselectedLocationHandler = () => {
    this.setState({ 
      name: "",
      address: "",
      long: this.props.long,
      lat: this.props.lat});
  }

  private _onModalShow = () => {
    Flurry.logEvent('Location Details - Update Address');
    
    this.setState({
      isLoading: false
    })
  }

  _onModalHide = () => {
    this.setState({
      isLoading: true
    })
  }

  private _onCancel = () => {
    this.props.cancelHandler();
  };

  private _onConfirm = () => {
    Flurry.logEvent('Location Details - Updated Address');

    if (this.state.name) {
      this.props.confirmHandler(this.state.name, this.state.address, this.state.long, this.state.lat);
    }   
  }

  render() {
    const { isVisible, t } = this.props;

    var contentElement = (
      <View style={styles.container}>
        {
          this.state.isLoading && <ActivityIndicator size="small" color="#00ff00" />
        }
        {
          !this.state.isLoading && 
          <View style={styles.container}>              
              <View style={styles.mapContainer}>
                <MapboxGL.MapView
                  style={{flex: 1}}
                >
                  <MapboxGL.Camera
                        styleURL={MapboxGL.StyleURL.Street}
                        zoomLevel={15}
                        centerCoordinate={[this.state.long, this.state.lat]}
                      >
                    </MapboxGL.Camera>
                </MapboxGL.MapView>
                <View style={styles.searchContainer}>
                  <SearchLocation
                    deselectHandler={this._deselectedLocationHandler}
                    confirmHandler={this._selectedLocationHandler}>
                  </SearchLocation>
                </View>
              </View>
          </View>            
        }        
      </View>
    );

    return (
      <ActionModal
        title={t("location_detail:update_address_title")}
        isVisible={isVisible}
        onCancelHandler={this._onCancel}
        onConfirmHandler={this._onConfirm}
        onModalShowHandler={this._onModalShow}
        onModalHideHandler={this._onModalHide}
      >
        {contentElement}
      </ActionModal>
    );
  }
}

interface Style {
  container: ViewStyle,
  searchContainer: ViewStyle;
  mapContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1
  },
  searchContainer: {
    position: "absolute",
    top: "3%",
    left: "3%",
    right: "3%"
  },
  mapContainer: {
    flex: 1,
    margin: 5
  }
})

const LocationAddressModal = connectStyle<typeof LocationAddressModalComponent>('NativeBase.Modal', styles)(LocationAddressModalComponent);
export default withNamespaces(['location_detail'])(LocationAddressModal);
