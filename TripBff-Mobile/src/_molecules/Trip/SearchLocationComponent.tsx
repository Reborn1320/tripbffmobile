//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text } from "native-base";
import { StyleSheet, ViewStyle, TouchableOpacity, TextStyle } from "react-native";
import { connectStyle } from 'native-base';
import  Autocomplete  from "react-native-autocomplete-input";

const mbxClient = require('@mapbox/mapbox-sdk');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const baseClient = mbxClient({ accessToken: 'pk.eyJ1IjoidHJpcGJmZiIsImEiOiJjanFtZHA3b2cxNXhmNDJvMm5tNHR4bTFpIn0.QKKFlCG0G5sEHIss1n-A8g' });
const geoCodingService = mbxGeocoding(baseClient);

export interface Props {
  confirmHandler: (name, address, long, lat) => void;
}

interface State {
  query: string;
  address: string,
  long: number,
  lat: number,
  places: Array<string>
}

class SearchLocationComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      places: [],
      query: '',
      address: '',
      long: 0,
      lat: 0,
    };    
  }

  searchPlaces(query){
    geoCodingService.forwardGeocode({
      query: query,
      countries: ['vn']
    })
    .send()
    .then(response => {
      const match = response.body;
      console.log('Places result: ' + JSON.stringify(match.features));
      var places = match.features.map((place) => {
        return {
          placeName: place.text,
          address: place.place_name,
          id: place.id,
          long: place.geometry.coordinates[0],
          lat: place.geometry.coordinates[1]
        };
      });
      this.setState({places: places});
    });
  }
 
  _onSelectedLocation(item) {
    this.setState({ 
        query: item.placeName,
        address: item.address,
        long: item.long,
        lat: item.lat,
        places: [] 
    });
    this.props.confirmHandler(item.placeName, item.address, item.long, item.lat);
  }

  _renderItem = (item) => {

    return (
        <TouchableOpacity onPress={() => this._onSelectedLocation(item)}>
          <Text style={styles.itemText}>{item.placeName}</Text>
        </TouchableOpacity>
      )
  }

  render() {
    return (
        <View>
            <Autocomplete                    
                autoCapitalize="none"
                placeholder="Search"
                autoCorrect={false}
                defaultValue={this.state.query}
                data={this.state.places}
                onChangeText={text => this.searchPlaces(text)}
                renderItem={this._renderItem}
                containerStyle={styles.autocompleteContainer}
                inputContainerStyle={styles.inputContainerStyle}
                listContainerStyle={styles.listContainerStyle}
            />
        </View>
    );
  }
}

interface Style {
  autocompleteContainer: ViewStyle;
  inputContainerStyle: ViewStyle;
  listContainerStyle: ViewStyle;
  itemText: TextStyle
}

const styles = StyleSheet.create<Style>({
  autocompleteContainer: {
    flex: 1,
    left: 5,
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1
  },
  inputContainerStyle: {    
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  listContainerStyle: {
    flex: 1,
    left: 5,
    right: 5,
    zIndex: 1
  },
  itemText: {
    fontSize: 15,
    margin: 2
  }
})
  
const SearchLocation = connectStyle<typeof SearchLocationComponent>('NativeBase.Modal', styles)(SearchLocationComponent);
export default SearchLocation;
