import * as React from "react";
import { View, Text, Button, H2 } from "native-base";
import { StyleSheet, ViewStyle } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
const mbxClient = require('@mapbox/mapbox-sdk');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const baseClient = mbxClient({ accessToken: 'pk.eyJ1IjoidHJpcGJmZiIsImEiOiJjanFtZHA3b2cxNXhmNDJvMm5tNHR4bTFpIn0.QKKFlCG0G5sEHIss1n-A8g' });
const geoCodingService = mbxGeocoding(baseClient);
import MapboxGL from '@react-native-mapbox-gl/maps';
MapboxGL.setAccessToken('pk.eyJ1IjoidHJpcGJmZiIsImEiOiJjanFtZHA3b2cxNXhmNDJvMm5tNHR4bTFpIn0.QKKFlCG0G5sEHIss1n-A8g');
import { getLabel } from "../../../i18n";
import SearchLocation from '../../_molecules/Trip/SearchLocationComponent';
import ActionModal from "../../_molecules/ActionModal";

export interface Props {
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
  lat: number
}

class LocationAddressModalComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: "",
      address: "",
      long: this.props.long,
      lat: this.props.lat
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

  private _onCancel = () => {
    this.props.cancelHandler();
  };

  private _onConfirm = () => {
    this.props.confirmHandler(this.state.name, this.state.address, this.state.long, this.state.lat);
  }

  render() {
    const { isVisible } = this.props;

    var contentElement = (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchLocation
            confirmHandler={this._selectedLocationHandler}>
          </SearchLocation>
        </View>
        <View style={styles.mapContainer}>
          <MapboxGL.MapView
            styleURL={MapboxGL.StyleURL.Street}
            zoomLevel={15}
            centerCoordinate={[this.state.long, this.state.lat]}
            style={{ flex: 1 }}
          >
          </MapboxGL.MapView>
        </View>
      </View>
    );

    return (
      <ActionModal
        title={getLabel("location_detail.update_address_title")}
        isVisible={isVisible}
        onCancelHandler={this._onCancel}
        onConfirmHandler={this._onConfirm}
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
export default LocationAddressModal;
