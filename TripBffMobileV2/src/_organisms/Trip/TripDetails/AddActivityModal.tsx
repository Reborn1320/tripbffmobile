//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Icon } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, 
          ActivityIndicator, TextStyle, Dimensions, Image, ImageStyle } from "react-native";
import { connectStyle } from 'native-base';
import { connect } from "react-redux";
import { getAllActivities } from "../../../store/DataSource/operations";
import { StoreData } from "../../../store/Interfaces";
import uuid4 from 'uuid/v4';
import SearchBarComponent from "../../../_atoms/SearchBarComponent";
import ActionModal from "../../../_molecules/ActionModal";
import { createLabelLocales } from "../../../_function/commonFunc";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";
import Flurry from 'react-native-flurry-sdk';

class SelectedActivityItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    var imageElement = this.props.item.icon ?
                            <Image style={styles.activityIcon}
                                source={{uri: this.props.item.icon}}
                              />  :
                              <Image style={styles.activityIcon} 
                                  source={require("../../../../assets/default_activity_icon.png")}>
                              </Image>

    return (
      <TouchableOpacity onPress={this._onPress}       
          style={[styles.activityItemContainer, styles.selectedActivityItemContainer]}>
          <View style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
                {imageElement}
            </View>
            <View style={styles.activityNameSelectedContainer}>
              <Text numberOfLines={1}>{this.props.item["label_" + this.props.locale]}</Text>   
            </View>
            <Icon name="md-close" type="Ionicons" style={styles.iconRemoved}/>          
          </View>
      </TouchableOpacity>
    );
  }
}

class ActivityItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    var imageElement = this.props.item.icon ?
    <Image style={styles.activityIcon}
        source={{uri: this.props.item.icon}}
      />  :
      <Image style={styles.activityIcon} 
          source={require("../../../../assets/default_activity_icon.png")}>
      </Image>

    return (
      <TouchableOpacity onPress={this._onPress} style={[styles.activityItemContainer, this.props.styles]}>
        <View style={styles.activityItem}>
          <View style={styles.activityIconContainer}>
              {imageElement}
          </View>
          <View style={styles.activityNameContainer}>
            <Text numberOfLines={1}>{this.props.item["label_" + this.props.locale]}</Text>
          </View>          
        </View>
      </TouchableOpacity>
    );
  }
}

class ActivityContainerComponent extends React.PureComponent<any, any> {
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
    return items.filter(item => !removedItem || removedItem.activityId != item.activityId);
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
        filterItems = filterItems.filter(item => item.activityId != this.state.newDefinedItem.activityId);

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
    var existedPreDefinedItem = this.props.items.find(item => item.activityId == deSelectedItem.activityId);
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

    this.props.removeSelectedActivityHandler(deSelectedItem);
  }

  _onConfirm = (selectedItem) => {
    if (this.state.newDefinedItem)
          selectedItem.activityId = uuid4();

    this.props.onConfirmHandler(selectedItem);
    // this.setState({
    //     preDefinedItems: this.props.items,
    //     selectedItem: null,
    //     newDefinedItem: null,
    //     search: ''
    //   });
  }

  _endReached = () => {
    if (!this.state.isStopReached) {
      let currentNumberOfItems = this.state.preDefinedItems.length,
          numberOfItems = currentNumberOfItems + this.state.numberOfItems,
          isStopReached = false; 
      
      if(numberOfItems > this.props.items.length) 
      {
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
      firstItemStyle = styles.firstActivityItemContainer;
    }

    return (    
      <ActivityItem
        item={item}
        onPressItem={this._onConfirm}
        styles={firstItemStyle}
        locale={this.props.locale}
      />
    );
  } 
  render() {
    return (
      <View style={styles.activityContainer}>
          <View>
            {
              this.state.selectedItem && this.state.selectedItem.activityId &&
              <SelectedActivityItem
                item={this.state.selectedItem}
                onPressItem={this._onDeselectConfirm}
                locale={this.props.locale}
              />
            }
          </View>
          <View>
            <SearchBarComponent updateSearch={this._updateSearch}></SearchBarComponent>    
         </View>
         <View style={styles.activityPreDefinedContainer}>
           <FlatList keyboardShouldPersistTaps={'handled'}            
             style={styles.activityPreDefinedFlatList}
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

interface IMapDispatchToProps {
  getAllActivities: () => Promise<StoreData.ActivityVM>
}

export interface Props {
  isVisible: boolean;
  locationId: string;
  dateIdx: number;
  preDefinedActivities?: Array<StoreData.PreDefinedActivityVM>
  selectedActivity?: StoreData.ActivityVM;
  locale?: string;
  confirmHandler: (locationId, activity) => void;
  cancelHandler?: () => void;
}

interface State {
  selectedItem: StoreData.ActivityVM,
  isLoadedData: boolean
}

class AddActivityModalComponent extends React.PureComponent<Props & IMapDispatchToProps & PropsBase, State> {
  constructor(props: Props & IMapDispatchToProps & PropsBase) {
    super(props);  

    this.state = {
      selectedItem: this.props.selectedActivity,
      isLoadedData: false
    }
  }  

  _onModalShow = () => {
    Flurry.logEvent('Trip Details/Edit - Add Activity');

    if (!this.props.preDefinedActivities) {
      this.props.getAllActivities();
    }
    this.setState({  
      selectedItem: this.props.selectedActivity,
      isLoadedData: true
    })
  }

  _onModalHide = () => {
    this.setState({
      isLoadedData: false
    })
  }

  _onCancel = () => {
    if (this.props.cancelHandler) {
      this.props.cancelHandler();
    }
  };

  _removeSelectedActivity = () => {
    this.setState({
      selectedItem: null
    });
  }

  _onConfirm = (activity) => { 
    Flurry.logEvent('Trip Details/Edit - Added Activity');
    this.props.confirmHandler(this.props.locationId, activity);
  }

  _onSave = () => {
    this.props.confirmHandler(this.props.locationId, this.state.selectedItem);
  }

  render() {
    const { isVisible, preDefinedActivities, selectedActivity, locale, t } = this.props;

    var contentElement = preDefinedActivities && this.state.isLoadedData
          ? <ActivityContainerComponent
              items={preDefinedActivities}
              selectedItem={selectedActivity}
              onConfirmHandler={this._onConfirm}
              removeSelectedActivityHandler={this._removeSelectedActivity}
              locale={locale}>
            </ActivityContainerComponent>
          : <ActivityIndicator size="small" color="#00ff00" />
          
    return (
        <ActionModal
          title={t("trip_detail:activity_modal_title")}
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
  activityContainer: ViewStyle;
  activityItemContainer: ViewStyle;
  firstActivityItemContainer: ViewStyle;
  activityPreDefinedContainer: ViewStyle;
  activityPreDefinedFlatList: ViewStyle;
  selectedActivityItemContainer: ViewStyle;
  activityItem: ViewStyle;
  activityNameContainer: ViewStyle;
  activityNameSelectedContainer: ViewStyle;
  activityIconContainer: ViewStyle;
  activityIcon: ImageStyle;
  iconRemoved: TextStyle;
}

const styles = StyleSheet.create<Style>({  
  activityContainer: {
    flex: 1,
    marginTop: 16
  },
  activityPreDefinedContainer: {
    flex: 1
  },
  activityPreDefinedFlatList: {
    flex: 1,
    marginTop: 12
  },
  activityItemContainer: {
    width: "94%",
    height: 44,
    marginLeft: "3%",
    marginRight: "3%",
    borderBottomWidth: 0.5,
    borderStyle: "solid",
    borderColor: '#DADADA'
  },
  firstActivityItemContainer: {
    borderTopWidth: 0.5
  },
  activityItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: "center"
  },
  selectedActivityItemContainer: {
    marginBottom: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5
  },
  activityIconContainer: {
    width: "15%"
  },
  activityIcon: {
    marginRight: 10,
    marginLeft: 20,
    width: 24,
    height: 24
  },
  activityNameContainer: {
    maxWidth: "85%"
  },
  activityNameSelectedContainer: {
    maxWidth: "75%"
  },
  iconRemoved: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 3,
    color: "#383838"
  }
})
  
// const AddActivityModalStyle = connectStyle<typeof AddActivityModalComponent>('NativeBase.Modal', styles)(AddActivityModalComponent);

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  let dateVm = storeState.currentTrip.dates.find(item => item.dateIdx == ownProps.dateIdx);
  let activity = null;

  if (dateVm) {
    let location = dateVm.locations.find(item => item.locationId == ownProps.locationId);
    activity = location && location.activity ? location.activity : activity;
  }

  return {
      preDefinedActivities: storeState.dataSource.activities,
      selectedActivity: activity,
      locale: storeState.user.locale
  };
};

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
  return {
    getAllActivities: () => dispatch(getAllActivities())
  };
};

const AddActivityModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddActivityModalComponent);

export default withNamespaces(['trip_detail'])(AddActivityModal);
