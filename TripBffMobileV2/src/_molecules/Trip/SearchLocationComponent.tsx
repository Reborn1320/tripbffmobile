import * as React from "react";
import { View, Text, Icon } from "native-base";
import { StyleSheet, ViewStyle, TouchableOpacity, TextStyle, Platform, Image, ImageStyle, TextInput } from "react-native";
import { connectStyle } from 'native-base';
import  Autocomplete  from "react-native-autocomplete-input";
import { getAddressFromLocation } from "../../_function/commonFunc";
import { mixins } from "../../_utils";
import { PropsBase } from "../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";
import { searchLocations } from "../../store/DataSource/operations";

export interface Props extends PropsBase {
  confirmHandler: (name, address, long, lat) => void;
  deselectHandler: () => void;
}

interface State {
  query: string;
  address: string,
  long: number,
  lat: number,
  places: Array<object>
}

class SearchLocationComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      places: [],
      query: '',
      address: '',
      long: 0,
      lat: 0,
    };    
  }  

  private _searchPlaces = async (query) => {
    this.setState({query: query});

    //call API to get locations from own DB first
    var locations = await searchLocations(query);

    if (locations.length == 0) {
      //if no locations found from own DB, call API to OSM
      var url = 'https://nominatim.openstreetmap.org/search?q=' + query +
      '&format=jsonv2&addressdetails=1&namedetails=1';   

      try {
        let response = await fetch(url);
        let jsonPlaces = await response.json();
        locations = jsonPlaces.map(place => {
          return {
            title: place.namedetails.name,
            address: getAddressFromLocation(place),              
            long: parseFloat(place.lon),
            lat: parseFloat(place.lat)
          }
        }); 
      }
      catch (error) {
        console.error(error);
      }
    }    
    
    this.setState({places: locations});
  }
 
  private _onSelectedLocation(item) {
    this.setState({ 
        query: item.title,
        address: item.address,
        long: item.long,
        lat: item.lat,
        places: [] 
    });
    this.props.confirmHandler(item.title, item.address, item.long, item.lat);
  }

  private _clearInputData = () => {
    this.setState({
        places: [],
        query: '',
        address: '',
        long: 0,
        lat: 0,
    });
    this.props.deselectHandler();
  }

  private _renderTextInput = (props) => {
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

  private _renderItem = ({ item }) => {
    var placeAddress =  item.address.replace(item.title + ',', '');

    return (
        <TouchableOpacity onPress={() => this._onSelectedLocation(item)}>
          <View style={styles.listViewContainer}>
            <Text numberOfLines={1} style={styles.placeNameText}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.addressText}>{placeAddress}</Text>
          </View>          
        </TouchableOpacity>
      )
  }

  render() {
    let listContainerBorder= this.state.places.length > 0 ? styles.listContainerHasBorder : "";
    const { t } = this.props;

    return (
      <View>        
        <Autocomplete
            autoCapitalize="none"
            placeholder={t("action:search")}
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
  
const SearchLocation = 
  connectStyle<typeof SearchLocationComponent>('NativeBase.Modal', styles)(SearchLocationComponent);
 
 export default withNamespaces(['action'])(SearchLocation);
