//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Icon } from "native-base";
import { StyleSheet, ViewStyle, TouchableOpacity, TextStyle, Platform } from "react-native";
import { connectStyle } from 'native-base';
import  Autocomplete  from "react-native-autocomplete-input";
import { getAddressFromLocation } from "../../_function/commonFunc";
import { TextInput } from "react-native-gesture-handler";

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
    var url = 'https://nominatim.openstreetmap.org/search?q=' + query +
                 '&format=jsonv2&addressdetails=1&namedetails=1';

    this.setState({query: query});

    return fetch(url)
            .then((response) => response.json())
            .then((jsonPlaces) => {
                let places = jsonPlaces.map(place => {
                  return {
                    placeName: place.namedetails.name,
                    address: getAddressFromLocation(place),
                    id: place.place_id,
                    long: parseFloat(place.lon),
                    lat: parseFloat(place.lat)
                  }
                });
                
                this.setState({places: places});
            })
            .catch((error) => {
                console.error(error);
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

  _clearInputData = () => {
    this.setState({
        places: [],
        query: '',
        address: '',
        long: 0,
        lat: 0,
    });
  }

  _renderTextInput = (props) => {
    if (Platform.OS === 'ios') {
      return (
        <TextInput {...props} clearButtonMode='always'/>
      )
    }
    else {
      return (
        <View style={styles.searchSection}>            
            <TextInput 
                {...props}    
                style={styles.searchInput}                  
                underlineColorAndroid="transparent"
            />
            <Icon type={"Ionicons"} name="md-close"
                  style={[styles.searchIcon, {fontSize: 21}]}
                  onPress={this._clearInputData}
                />
        </View>
      )      
    }
  }

  _renderItem = (item) => {
    var placeAddress =  item.address.replace(item.placeName + ',', '');

    return (
        <TouchableOpacity onPress={() => this._onSelectedLocation(item)}>
          <View style={styles.listViewContainer}>
            <Text numberOfLines={1} style={styles.placeNameText}>{item.placeName}</Text>
            <Text numberOfLines={1} style={styles.addressText}>{placeAddress}</Text>
          </View>          
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
            value={this.state.query}      
            onChangeText={text => this.searchPlaces(text)}               
            data={this.state.places}
            renderItem={this._renderItem}
            renderTextInput={this._renderTextInput}
            containerStyle={styles.autocompleteContainer}
            inputContainerStyle={styles.inputContainerStyle}
            listStyle={styles.listStyle}
          />
      </View>      
    );
  }
}

interface Style {
  autocompleteContainer: ViewStyle;
  inputContainerStyle: ViewStyle;
  listViewContainer: ViewStyle;
  listStyle: ViewStyle;
  placeNameText: TextStyle;
  addressText: TextStyle;
  searchSection: ViewStyle;
  searchIcon: TextStyle;
  searchInput: TextStyle;
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
  listViewContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderBottomWidth: 0.5,
    height: 50,
    borderColor: '#d6d7da'
  },
  inputContainerStyle: {    
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#d6d7da',
  },
  listStyle: {
    margin: 0,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5
  },
  placeNameText: {
    fontSize: 16,
    paddingLeft: 2,
    paddingTop: 2,
    fontWeight: 'bold'    
  },
  addressText: {
    fontSize: 14, 
    fontWeight: 'normal'
  },
  searchSection: {
    flexDirection: 'row',    
    justifyContent:'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 40
  },
  searchIcon: {
      padding: 10,      
      color: "#cccccc"
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#424242',
  },
})
  
const SearchLocation = connectStyle<typeof SearchLocationComponent>('NativeBase.Modal', styles)(SearchLocationComponent);
export default SearchLocation;
