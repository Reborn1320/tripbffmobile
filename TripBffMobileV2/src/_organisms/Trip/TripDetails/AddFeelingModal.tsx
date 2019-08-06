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
import uuid4 from 'uuid/v4';
import NBColor from "../../../theme/variables/material.js";
import { mixins } from "../../../_utils";
import SearchBarComponent from "../../../_atoms/SearchBarComponent";
import ActionModal from "../../../_molecules/ActionModal";

class SelectedFeelingItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}       
          style={[styles.selectedFeelingItemContainer]}>
          <View style={styles.feelingItem}>  
            <View style={styles.feelingIconSelectedIconContainer}>
              <Icon type="FontAwesome5" name={this.props.item.icon} /> 
            </View>                
            <View style={styles.feelingNameSelectedContainer}>
              <Text numberOfLines={1}>{this.props.item.label}</Text>   
            </View> 
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
          <View style={styles.feelingNameContainer}>
            <Text numberOfLines={1}>{this.props.label}</Text>
          </View> 
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
            <SearchBarComponent updateSearch={this._updateSearch}></SearchBarComponent>             
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
      <ActionModal
         title={getLabel("trip_detail.feeling_modal_title")}
         isVisible={isVisible}
         onModalShowHandler={this._onModalShow}
         onCancelHandler={this._onCancel}
         onConfirmHandler={this._onSave}>
        {contentElement}
      </ActionModal>        
    );
  }
}

interface Style {
  feelingContainer: ViewStyle;
  feelingPreDefinedContainer: ViewStyle;
  feeelingPreDefinedFlatList: ViewStyle;
  feelingItemContainer: ViewStyle;
  feelingNameContainer: ViewStyle;
  selectedFeelingItemContainer: ViewStyle;
  feelingIconSelectedIconContainer: ViewStyle;
  feelingNameSelectedContainer: ViewStyle;
  feelingItem: ViewStyle;
  feelingIcon: TextStyle;
  iconRemoved: TextStyle;
}

const styles = StyleSheet.create<Style>({  
  feelingContainer: {
    flex: 1
  },
  feelingPreDefinedContainer: {
    flex: 1
  },
  feeelingPreDefinedFlatList: {
    flex: 1,
    marginTop: 12
  },
  feelingItemContainer: {
    width: Dimensions.get('window').width / 2,
    height: 40,    
    borderWidth: 0.5,
    borderStyle: "solid",
    borderColor: '#DADADA'
  },
  feelingNameContainer: {
    maxWidth: "80%"
  },
  selectedFeelingItemContainer: {
    width: "94%",
    height: 44,
    marginLeft: "3%",
    marginRight: "3%",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderStyle: "solid",
    borderColor: '#DADADA',
    
    marginBottom: 10
  },
  feelingIconSelectedIconContainer: {
    width: "13%"
  },
  feelingNameSelectedContainer: {
    maxWidth: "75%"
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
