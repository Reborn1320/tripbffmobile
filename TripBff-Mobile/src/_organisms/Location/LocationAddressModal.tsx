//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Button, H2 } from "native-base";
import { StyleSheet, ViewStyle } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
const mbxClient = require('@mapbox/mapbox-sdk');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const baseClient = mbxClient({ accessToken: 'pk.eyJ1IjoidHJpcGJmZiIsImEiOiJjanFtZHA3b2cxNXhmNDJvMm5tNHR4bTFpIn0.QKKFlCG0G5sEHIss1n-A8g' });
const geoCodingService = mbxGeocoding(baseClient);
import Mapbox from '@mapbox/react-native-mapbox-gl';
Mapbox.setAccessToken('pk.eyJ1IjoidHJpcGJmZiIsImEiOiJjanFtZHA3b2cxNXhmNDJvMm5tNHR4bTFpIn0.QKKFlCG0G5sEHIss1n-A8g');
import moment from "moment";
import SearchLocation from '../../_molecules/Trip/SearchLocationComponent'

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

  _selectedLocationHandler = (name, address, long, lat) => {
      this.setState({
        name: name,
        address: address,
        long: long,
        lat: lat
      });
  }

  _onCancel = () => {
      this.props.cancelHandler();
  };

  _onConfirm = () => {
      this.props.confirmHandler(this.state.name, this.state.address, this.state.long, this.state.lat);
  }  

  render() {
    const { isVisible } = this.props;

    return (
        <RNModal style={styles.modal} 
            isVisible={isVisible} hideModalContentWhileAnimating>
            <View style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                    <Button transparent onPress={this._onCancel}><Text>Cancel</Text></Button>
                    <Button transparent onPress={this._onConfirm}><Text>Save</Text></Button>
                </View>
                <SearchLocation 
                  confirmHandler={this._selectedLocationHandler}></SearchLocation>
                <View style={{ flex: 4 }}>
                    <Mapbox.MapView
                        styleURL={Mapbox.StyleURL.Street}
                        zoomLevel={15}
                        centerCoordinate={[this.state.long, this.state.lat]}                        
                        style={{ flex: 1 }}
                        >
                    </Mapbox.MapView>                
                </View>                
            </View>
        </RNModal>
    );
  }
}

interface Style {
  modal: ViewStyle,
  buttons: ViewStyle;
  modalInnerContainer: ViewStyle;
  placesContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalInnerContainer: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  placesContainer: {
    flex: 6
  }
})
  
const LocationAddressModal = connectStyle<typeof LocationAddressModalComponent>('NativeBase.Modal', styles)(LocationAddressModalComponent);
export default LocationAddressModal;
