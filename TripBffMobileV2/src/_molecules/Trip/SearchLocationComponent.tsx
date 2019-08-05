//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Icon } from "native-base";
import { StyleSheet, ViewStyle, TouchableOpacity, TextStyle, Platform, Image, ImageStyle } from "react-native";
import { connectStyle } from 'native-base';
import  Autocomplete  from "react-native-autocomplete-input";
import { getAddressFromLocation } from "../../_function/commonFunc";
import { TextInput } from "react-native-gesture-handler";
import { getLabel } from "../../../i18n";
import { mixins } from "../../_utils";

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

  private _searchPlaces = (query) => {
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
            <Image
              style={styles.searchIcon}
              source={require('../../../assets/SearchIcon.png')}
            />
            <TextInput 
                {...props}    
                style={styles.searchInput}                  
                underlineColorAndroid="transparent"
            />
            <Icon type={"Ionicons"} name="md-close-circle"
                  style={[styles.clearIcon, {fontSize: 22, color: "#383838"}]}
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
    let listContainerBorder= this.state.places.length > 0 ? styles.listContainerHasBorder : "";

    return (
      <View>        
        <Autocomplete
            autoCapitalize="none"
            placeholder={getLabel("action.search")}
            autoCorrect={false}
            value={this.state.query}      
            onChangeText={this._searchPlaces}               
            data={this.state.places}
            renderItem={this._renderItem}
            renderTextInput={this._renderTextInput}
            containerStyle={styles.autocompleteContainer}
            inputContainerStyle={styles.inputContainerStyle}
            listStyle={styles.listStyle}
            listContainerStyle={[styles.listContainerStyle, listContainerBorder]}
          />
      </View>      
    );
  }
}

interface Style {
  autocompleteContainer: ViewStyle;
  inputContainerStyle: ViewStyle;
  listContainerStyle: ViewStyle;
  listContainerHasBorder: ViewStyle;
  listViewContainer: ViewStyle;
  listStyle: ViewStyle;
  placeNameText: TextStyle;
  addressText: TextStyle;
  searchSection: ViewStyle;
  searchIcon: ImageStyle;
  clearIcon: TextStyle;
  searchInput: TextStyle;
}

const styles = StyleSheet.create<Style>({
  autocompleteContainer: {
    flex: 1,
    left: "3%",
    position: 'absolute',
    right: "3%",
    top: "3%",
    zIndex: 1    
  },
  listViewContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: 50,
    marginLeft: 10
  },
  inputContainerStyle: {    
    borderStyle: "solid",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#ECEBED",
  },
  listContainerStyle: {
    borderStyle: "solid",
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderWidth: 0,
    borderColor: "#ECEBED"
  },
  listContainerHasBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 0
  },
  listStyle: {
    margin: 0,
    borderWidth: 0
  },
  placeNameText: {
    fontSize: 15,
    paddingLeft: 2,
    paddingTop: 2,
    ...mixins.themes.fontSemiBold,
    fontStyle: "normal",
    color: '#383838',
    lineHeight: 20
  },
  addressText: {
    fontSize: 13, 
    ...mixins.themes.fontNormal,
    color: '#383838',
    lineHeight: 18
  },
  searchSection: {
    flexDirection: 'row',    
    justifyContent:'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 50
  },
  searchIcon: {
    marginLeft: 10
  },
  clearIcon: {
      padding: 10,      
      color: "#cccccc"
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#383838',
    fontSize: 15,
    fontFamily: mixins.themes.fontNormal.fontFamily
  },
})
  
const SearchLocation = connectStyle<typeof SearchLocationComponent>('NativeBase.Modal', styles)(SearchLocationComponent);
export default SearchLocation;
