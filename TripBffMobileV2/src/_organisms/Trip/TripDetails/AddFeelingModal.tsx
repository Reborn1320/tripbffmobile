//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Button, Toast, Icon } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, TextStyle } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import { connect } from "react-redux";
import { getAllFeelings } from "../../../store/DataSource/operations";
import { StoreData } from "../../../store/Interfaces";
import { getLabel } from "../../../../i18n";
import { SearchBar } from 'react-native-elements';
import uuid4 from 'uuid/v4';
import NBColor from "../../../theme/variables/material.js";
import { mixins } from "../../../_utils"

class SelectedFeelingItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}       
          style={[styles.feelingItemContainer, styles.selectedFeelingItemContainer]}>
          <View style={styles.feelingItem}>      
            <Icon style={styles.feelingIcon} type="FontAwesome5" name={this.props.item.icon} />     
            <Text>{this.props.item.label}</Text>   
            <Icon name="md-close" type="Ionicons" style={styles.iconRemoved}/>           
          </View>
      </TouchableOpacity>
    );
  }
}

class FeelingItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem({
      feelingId: this.props.id,
      label: this.props.label,
      icon: this.props.icon
    });
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress} style={styles.feelingItemContainer}>
        <View style={styles.feelingItem}>
          <Icon style={styles.feelingIcon} type="FontAwesome5" name={this.props.icon} />  
          <Text>{this.props.label}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class FeelingContainerComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      preDefinedItems: [],
      newDefinedItem: null,
      selectedItem: null
    }
  }

  componentDidMount() {
    this.setState({
      preDefinedItems:  this.props.items.filter(item => !this.props.selectedItem || this.props.selectedItem.feelingId != item.feelingId),
      selectedItem: this.props.selectedItem
    });
  }

  _updateSearch = search => {
    var filterItems = this.props.items.filter(item => !this.state.selectedItem || this.state.selectedItem.feelingId != item.feelingId);
    var newItem = null;

    if (search) {
      let numberOfCharacters = search.length;

      if (numberOfCharacters > 20) {
        Toast.show({
            text: getLabel("location_detail.user_defined_like_dislike_warning"),
            buttonText: "Okay",
            position: "top",
            type: "warning",
            duration: 3000
        });
      }
      else {
        var searchLower = search.toLowerCase();
            filterItems = filterItems.filter(item => item.label.toLowerCase().includes(searchLower));

        if (this.state.newDefinedItem)
          filterItems = filterItems.filter(item => item.feelingId != this.state.newDefinedItem.feelingId);

        var exactItem = filterItems.find(item => item.label.toLowerCase() == searchLower);

        if (!exactItem) {
          newItem = { 
            label: search
          };
          filterItems.push(newItem);         
        }     
      }      
    }
    
    this.setState({ preDefinedItems: filterItems, search: search, newDefinedItem: newItem });
  };

  _onDeselectConfirm = (deSelectedItem) => {
    var selectedItem = null;
    var existedPreDefinedItem = this.props.items.find(item => item.feelingId == deSelectedItem.feelingId);
    var preDefinedItems = existedPreDefinedItem 
                    ? [...this.state.preDefinedItems, deSelectedItem]
                    : this.state.preDefinedItems;
    var search = this.state.search;

    if (search) {
      var searchLower = search.toLowerCase();
      preDefinedItems = preDefinedItems.filter(item => item.label.toLowerCase().includes(searchLower));
    }

    this.setState({
      preDefinedItems: preDefinedItems,
      selectedItem: selectedItem,
      newDefinedItem: null
    });

    this.props.removeSelectedFeelingHandler(deSelectedItem);
  }

  _onConfirm = (selectedItem) => {
    let numberOfCharacters = selectedItem.label.length;

    if (numberOfCharacters > 20) {
      Toast.show({
          text: getLabel("location_detail.user_defined_like_dislike_warning"),
          buttonText: "Okay",
          position: "top",
          type: "warning",
          duration: 3000
      });
    }
    else {
      if (this.state.newDefinedItem)
          selectedItem.feelingId = uuid4();

      this.setState({
        preDefinedItems: this.props.items,
        selectedItem: null,
        newDefinedItem: null,
        search: ''
      });
      this.props.onConfirmHandler(selectedItem);
    }   
  }

  _keyExtractor = (item, index) => item.feelingId;

  _renderItem = ({item}) => (
    <FeelingItem
      id={item.feelingId}
      label={item.label}
      icon={item.icon}
      onPressItem={this._onConfirm}
    />
  );

  render() {
    return (
      <View style={styles.feelingContainer}>
          <View>
            {
              this.state.selectedItem && this.state.selectedItem.feelingId &&
              <SelectedFeelingItem
                item={this.state.selectedItem}
                onPressItem={this._onDeselectConfirm}
              />
            }
          </View>
          <View>
             <SearchBar
               placeholder={getLabel("action.search")}
               onChangeText={this._updateSearch}
               value={this.state.search}
             />
         </View>
         <View style={styles.feelingPreDefinedContainer}>
           <FlatList keyboardShouldPersistTaps={'handled'}            
             style={styles.feeelingPreDefinedFlatList}
             data={this.state.preDefinedItems}
             keyExtractor={this._keyExtractor}
             renderItem={this._renderItem}
             numColumns={2}
           />
         </View>
      </View>
   );
  }
}

interface IMapDispatchToProps {
  getAllFeelings: () => Promise<StoreData.FeelingVM>
}

export interface Props {
  isVisible: boolean;
  locationId: string;
  dateIdx: number;
  preDefinedFeelings?: Array<StoreData.PreDefinedFeelingVM>;
  selectedFeeling?: StoreData.FeelingVM;
  confirmHandler: (locationId, feeling) => void;
  cancelHandler?: () => void;
}

interface State {
  selectedItem: StoreData.FeelingVM
}

class AddFeelingModalComponent extends React.Component<Props & IMapDispatchToProps, State> {
  constructor(props: Props & IMapDispatchToProps) {
    super(props);  

    this.state = {
      selectedItem: this.props.selectedFeeling
    }
  }

  _onModalShow = () => {
    if (!this.props.preDefinedFeelings) {
      this.props.getAllFeelings();
    }
    this.setState({
      selectedItem: this.props.selectedFeeling
    })
  }

  _removeSelectedFeeling = () => {
    this.setState({
      selectedItem: null
    });
  }

  _onCancel = () => {
    this.props.cancelHandler();
  };

  _onConfirm = (feeling) => { 
    this.props.confirmHandler(this.props.locationId, feeling);
  }  

  _onSave = () => {
    this.props.confirmHandler(this.props.locationId, this.state.selectedItem);
  }

  render() {
    const { isVisible, preDefinedFeelings } = this.props;
    var contentElement = preDefinedFeelings
          ? <FeelingContainerComponent
               items={preDefinedFeelings}
               selectedItem={this.props.selectedFeeling}
               onConfirmHandler={this._onConfirm}
               removeSelectedFeelingHandler={this._removeSelectedFeeling}>
            </FeelingContainerComponent>
          : <ActivityIndicator size="small" color="#00ff00" />
          
    return (
        <RNModal style={styles.modal} 
            onModalShow={this._onModalShow}
            isVisible={isVisible} hideModalContentWhileAnimating>
            <View style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={this._onCancel} style={styles.cancelButtonContainer}>
                        <Icon name="md-close" type="Ionicons" style={styles.cancelButtonIcon}></Icon>
                    </TouchableOpacity>
                    <Text style={styles.title}
                        >{getLabel("trip_detail.feeling_modal_title")}
                    </Text>
                    <TouchableOpacity onPress={this._onSave} style={styles.saveButtonContainer}>
                        <Icon name="md-checkmark" type="Ionicons" style={styles.saveButtonIcon}></Icon>
                    </TouchableOpacity>
                </View>
                <View style={styles.feelingContainer}>
                  {contentElement}
                </View>                
            </View>
        </RNModal>
    );
  }
}

interface Style {
  modal: ViewStyle,
  buttons: ViewStyle;
  cancelButtonContainer: ViewStyle;
  cancelButtonIcon: TextStyle;
  title: TextStyle;
  saveButtonContainer: ViewStyle;
  saveButtonIcon: TextStyle;
  modalInnerContainer: ViewStyle;
  feelingContainer: ViewStyle;
  feelingPreDefinedContainer: ViewStyle;
  feeelingPreDefinedFlatList: ViewStyle;
  feelingItemContainer: ViewStyle;
  selectedFeelingItemContainer: ViewStyle;
  feelingItem: ViewStyle;
  feelingIcon: TextStyle;
  iconRemoved: TextStyle;
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30
  },
  cancelButtonContainer: {
    marginTop: 15,
    marginLeft: 20
  },
  cancelButtonIcon: {
    fontSize: 26
  },
  title: {
    marginTop: 15,
    marginLeft: 20,
    color: NBColor.brandPrimary,
    fontSize: 18,
    fontStyle: "normal",
    fontFamily: mixins.themes.fontBold.fontFamily
  },
  saveButtonContainer:{
    marginTop: 15,
    marginRight: 20
  },
  saveButtonIcon: {
    fontSize: 26,
    color: NBColor.brandPrimary
  },
  modalInnerContainer: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  feelingContainer: {
    flex: 1
  },
  feelingPreDefinedContainer: {
    flex: 1
  },
  feeelingPreDefinedFlatList: {
    flex: 1,
    marginVertical: 20
  },
  feelingItemContainer: {
    width: Dimensions.get('window').width / 2,
    height: 40,    
    borderWidth: 0.5,
    borderStyle: "solid",
    borderColor: '#DADADA'
  },
  selectedFeelingItemContainer: {
    marginBottom: 10
  },
  feelingItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: "center"
  },
  feelingIcon: {
    marginRight: 10,
    marginLeft: 25
  },
  iconRemoved: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 3,
    color: "#383838"
  }
})
  
const AddFeelingModalStyle = connectStyle<typeof AddFeelingModalComponent>('NativeBase.Modal', styles)(AddFeelingModalComponent);

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
  let dateVm = storeState.currentTrip.dates.find(item => item.dateIdx == ownProps.dateIdx);
  let feeling = null;

  if (dateVm) {
    let location = dateVm.locations.find(item => item.locationId == ownProps.locationId);
    feeling = location && location.feeling ? location.feeling : feeling;
  }

  return {
      preDefinedFeelings: storeState.dataSource.feelings,
      selectedFeeling: feeling
  };
};

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
  return {
    getAllFeelings: () => dispatch(getAllFeelings())
  };
};

const AddFeelingModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddFeelingModalStyle);

export default AddFeelingModal;
