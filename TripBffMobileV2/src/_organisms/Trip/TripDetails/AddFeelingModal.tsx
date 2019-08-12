//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Button, Toast, Icon } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity,
         ActivityIndicator, Dimensions, TextStyle, Image, ImageStyle } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import { connect } from "react-redux";
import { getAllFeelings } from "../../../store/DataSource/operations";
import { StoreData } from "../../../store/Interfaces";
import uuid4 from 'uuid/v4';
import { createLabelLocales } from "../../../_function/commonFunc";
import SearchBarComponent from "../../../_atoms/SearchBarComponent";
import ActionModal from "../../../_molecules/ActionModal";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";

class SelectedFeelingItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    var imageElement = this.props.item.icon ?
                            <Image style={styles.feelingIcon}
                                source={{uri: this.props.item.icon}}
                              />  :
                              <Image style={styles.feelingIcon} 
                                  source={require("../../../../assets/default_feeling_icon.png")}>
                              </Image>
    return (
      <TouchableOpacity onPress={this._onPress}       
          style={[styles.selectedFeelingItemContainer]}>
          <View style={styles.feelingItem}>  
            <View style={styles.feelingIconSelectedIconContainer}>
               {imageElement}
            </View>                
            <View style={styles.feelingNameSelectedContainer}>
              <Text numberOfLines={1}>{this.props.item["label_" + this.props.locale]}</Text>   
            </View> 
            <Icon name="md-close" type="Ionicons" style={styles.iconRemoved}/>           
          </View>
      </TouchableOpacity>
    );
  }
}

class FeelingItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    var imageElement = this.props.item.icon ?
                            <Image style={styles.feelingIcon}
                                source={{uri: this.props.item.icon}}
                              />  :
                              <Image style={styles.feelingIcon} 
                                  source={require("../../../../assets/default_feeling_icon.png")}>
                              </Image>

    return (
      <TouchableOpacity onPress={this._onPress} style={[styles.feelingItemContainer, this.props.styles]}>
        <View style={styles.feelingItem}>
          <View style={styles.feelingIconContainer}>
            {imageElement}
          </View>
          <View style={styles.feelingNameContainer}>
            <Text numberOfLines={2}>{this.props.item["label_" + this.props.locale]}</Text>
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
      selectedItem: null,
      numberOfItems: 0,
      isStopReached: false
    }
  }

  componentDidMount() {
    let { height } = Dimensions.get('window');
    let numberOfItems = Math.ceil((height - 40) / 44);
    let filterItems = this._filterItems(this.props.items, this.props.selectedItem);

    this.setState({
      preDefinedItems: filterItems.slice(0, numberOfItems),
      selectedItem: this.props.selectedItem,
      numberOfItems: numberOfItems
    });
  }

  private _filterItems = (items, removedItem) => {
    return items.filter(item => !removedItem || removedItem.feelingId != item.feelingId);
  }

  _updateSearch = search => {
    var filterItems = this._filterItems(this.props.items, this.state.selectedItem);
    var newItem = null;
    var isStopReached = false;

    if (search) {
      isStopReached = true;
      var searchLower = search.toLowerCase();
      filterItems = filterItems.filter(item => item["label_" + this.props.locale].toLowerCase().includes(searchLower));

      if (this.state.newDefinedItem)
        filterItems = filterItems.filter(item => item.feelingId != this.state.newDefinedItem.feelingId);

      var exactItem = filterItems.find(item => item["label_" + this.props.locale].toLowerCase() == searchLower);

      if (!exactItem) {
        newItem = createLabelLocales(search);
        filterItems.push(newItem);         
      }          
    }
    
    this.setState({ preDefinedItems: filterItems, search: search, newDefinedItem: newItem, isStopReached: isStopReached });
  };

  _onDeselectConfirm = (deSelectedItem) => {
    var selectedItem = null;
    var existedPreDefinedItem = this.props.items.find(item => item.feelingId == deSelectedItem.feelingId);
    var preDefinedItems = existedPreDefinedItem 
                    ? [deSelectedItem, ...this.state.preDefinedItems]
                    : this.state.preDefinedItems;
    var search = this.state.search;

    if (search) {
      var searchLower = search.toLowerCase();
      preDefinedItems = preDefinedItems.filter(item => item["label_" + this.props.locale].toLowerCase().includes(searchLower));
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

    // this.setState({
    //   preDefinedItems: this.props.items,
    //   selectedItem: null,
    //   newDefinedItem: null,
    //   search: ''
    // });
    this.props.onConfirmHandler(selectedItem); 
  }

  _endReached = () => {
    if (!this.state.isStopReached) {
      let currentNumberOfItems = this.state.preDefinedItems.length,
          numberOfItems = currentNumberOfItems + this.state.numberOfItems,
          isStopReached = false;
  
      if (numberOfItems > this.props.items.length) {
          numberOfItems = this.props.items.length;
          isStopReached = true;
      } 

      let filterItems = this._filterItems(this.props.items, this.props.selectedItem);
      this.setState({
        preDefinedItems: filterItems.slice(0, numberOfItems),
        isStopReached: isStopReached
      });
    }   
  }
  
  _keyExtractor = (item, index) => item.label_en;

  _renderItem = ({item, index}) => {
    let firstItemStyle;

    if (index == 0) {
      firstItemStyle = styles.firstFeelingItemContainer;
    }

    return (
      <FeelingItem
        item={item}
        onPressItem={this._onConfirm}
        locale={this.props.locale}
        styles={firstItemStyle}
      />
    )
  };

  render() {

    return (
      <View style={styles.feelingContainer}>
          <View>
            {
              this.state.selectedItem && this.state.selectedItem.feelingId &&
              <SelectedFeelingItem
                item={this.state.selectedItem}
                locale={this.props.locale}
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
             numColumns={1}
             onEndReached={this._endReached}
             onEndReachedThreshold={.7}
           />
         </View>
      </View>
   );
  }
}

interface IMapDispatchToProps extends PropsBase {
  getAllFeelings: () => Promise<StoreData.FeelingVM>
}

export interface Props {
  isVisible: boolean;
  locationId: string;
  dateIdx: number;
  preDefinedFeelings?: Array<StoreData.PreDefinedFeelingVM>;
  selectedFeeling?: StoreData.FeelingVM;
  locale?: string;
  confirmHandler: (locationId, feeling) => void;
  cancelHandler?: () => void;
}

interface State {
  selectedItem: StoreData.FeelingVM,
  isLoadedData: boolean
}

class AddFeelingModalComponent extends React.Component<Props & IMapDispatchToProps, State> {
  constructor(props: Props & IMapDispatchToProps) {
    super(props);  

    this.state = {
      selectedItem: this.props.selectedFeeling,
      isLoadedData: false
    }
  }

  _onModalShow = () => {
    if (!this.props.preDefinedFeelings) {
      this.props.getAllFeelings();
    }
    this.setState({
      selectedItem: this.props.selectedFeeling,
      isLoadedData: true
    })
  }

  _onModalHide = () => {
    this.setState({
      isLoadedData: false
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
    const { isVisible, preDefinedFeelings, locale, t } = this.props;
    console.log('feelings: ' + JSON.stringify(preDefinedFeelings));
    var contentElement = preDefinedFeelings && this.state.isLoadedData
          ? <FeelingContainerComponent
               items={preDefinedFeelings}
               selectedItem={this.props.selectedFeeling}
               onConfirmHandler={this._onConfirm}
               removeSelectedFeelingHandler={this._removeSelectedFeeling}
               locale={locale}>
            </FeelingContainerComponent>
          : <ActivityIndicator size="small" color="#00ff00" />
          
    return (
      <ActionModal
         title={t("trip_detail:feeling_modal_title")}
         isVisible={isVisible}
         onModalShowHandler={this._onModalShow}
         onModalHideHandler={this._onModalHide}
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
  firstFeelingItemContainer: ViewStyle;
  feelingNameContainer: ViewStyle;
  feelingIconContainer: ViewStyle;
  selectedFeelingItemContainer: ViewStyle;
  feelingIconSelectedIconContainer: ViewStyle;
  feelingNameSelectedContainer: ViewStyle;
  feelingItem: ViewStyle;
  feelingIcon: ImageStyle;
  iconRemoved: TextStyle;
}

const styles = StyleSheet.create<Style>({  
  feelingContainer: {
    flex: 1,
    marginTop: 16
  },
  feelingPreDefinedContainer: {
    flex: 1
  },
  feeelingPreDefinedFlatList: {
    flex: 1,
    marginTop: 12
  },
  feelingItemContainer: {
    width: "94%",
    height: 44,
    marginLeft: "3%",
    marginRight: "3%",
    borderBottomWidth: 0.5,
    borderStyle: "solid",
    borderColor: '#DADADA'
  },
  firstFeelingItemContainer: {
    borderTopWidth: 0.5
  },
  feelingNameContainer: {
    maxWidth: "85%"
  },
  feelingIconContainer: {
    width: "15%"
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
    width: "15%"
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
    marginLeft: 20,
    width: 24,
    height: 24
  },
  iconRemoved: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 3,
    color: "#383838"
  }
})
  
const AddFeelingModalStyle = connectStyle<typeof AddFeelingModalComponent>('NativeBase.Modal', styles)(AddFeelingModalComponent);

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  let dateVm = storeState.currentTrip.dates.find(item => item.dateIdx == ownProps.dateIdx);
  let feeling = null;

  if (dateVm) {
    let location = dateVm.locations.find(item => item.locationId == ownProps.locationId);
    feeling = location && location.feeling ? location.feeling : feeling;
  }

  return {
      preDefinedFeelings: storeState.dataSource.feelings,
      selectedFeeling: feeling,
      locale: storeState.user.locale
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllFeelings: () => dispatch(getAllFeelings())
  };
};

const AddFeelingModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddFeelingModalStyle);

export default withNamespaces(['trip_detail'])(AddFeelingModal);
