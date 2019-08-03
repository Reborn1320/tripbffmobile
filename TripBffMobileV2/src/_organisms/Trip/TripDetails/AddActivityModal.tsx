//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Button, Icon, Toast } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, TextStyle } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import { connect } from "react-redux";
import { getAllActivities } from "../../../store/DataSource/operations";
import { StoreData } from "../../../store/Interfaces";
import { getLabel } from "../../../../i18n";
import uuid4 from 'uuid/v4';
import NBColor from "../../../theme/variables/material.js";
import { mixins } from "../../../_utils";
import SearchBarComponent from "../../../_atoms/SearchBarComponent";

class SelectedActivityItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}       
          style={[styles.activityItemContainer, styles.selectedActivityItemContainer]}>
          <View style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              <Icon style={styles.activityIcon} type="FontAwesome5" name={this.props.item.icon} />
            </View>
            <View style={styles.activityNameSelectedContainer}>
              <Text numberOfLines={1}>{this.props.item.label}</Text>   
            </View>
            <Icon name="md-close" type="Ionicons" style={styles.iconRemoved}/>          
          </View>
      </TouchableOpacity>
    );
  }
}

class ActivityItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem({
      activityId: this.props.id,
      label: this.props.label,
      icon: this.props.icon
    });
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress} style={[styles.activityItemContainer, this.props.styles]}>
        <View style={styles.activityItem}>
          <View style={styles.activityIconContainer}>
            <Icon style={styles.activityIcon} type="FontAwesome5" name={this.props.icon} /> 
          </View>
          <View style={styles.activityNameContainer}>
            <Text numberOfLines={1}>{this.props.label}</Text>
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
      selectedItem: null
    }
  }

  componentDidMount() {
    this.setState({
      preDefinedItems:  this.props.items.filter(item => !this.props.selectedItem || this.props.selectedItem.activityId != item.activityId),
      selectedItem: this.props.selectedItem
    });
  }

  _updateSearch = search => {
    var filterItems = this.props.items.filter(item => !this.state.selectedItem || this.state.selectedItem.activityId != item.activityId);
    var newItem = null;

    if (search) {
      let numberOfCharacters = search.length;

      var searchLower = search.toLowerCase();
      filterItems = filterItems.filter(item => item.label.toLowerCase().includes(searchLower));

      if (this.state.newDefinedItem)
        filterItems = filterItems.filter(item => item.activityId != this.state.newDefinedItem.activityId);

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
    var existedPreDefinedItem = this.props.items.find(item => item.activityId == deSelectedItem.activityId);
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

    this.props.removeSelectedActivityHandler(deSelectedItem);
  }

  _onConfirm = (selectedItem) => {
    if (this.state.newDefinedItem)
          selectedItem.activityId = uuid4();

      this.setState({
        preDefinedItems: this.props.items,
        selectedItem: null,
        newDefinedItem: null,
        search: ''
      });
    this.props.onConfirmHandler(selectedItem);
  }

  _keyExtractor = (item, index) => item.activityId;

  _renderItem = ({item, index}) => {
    let firstItemStyle;

    if (index == 0) {
      firstItemStyle = styles.firstActivityItemContainer;
    }

    return (    
      <ActivityItem
        id={item.activityId}
        label={item.label}
        icon={item.icon}
        onPressItem={this._onConfirm}
        styles={firstItemStyle}
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
  confirmHandler: (locationId, activity) => void;
  cancelHandler?: () => void;
}

interface State {
  selectedItem: StoreData.ActivityVM
}

class AddActivityModalComponent extends React.PureComponent<Props & IMapDispatchToProps, State> {
  constructor(props: Props & IMapDispatchToProps) {
    super(props);  
  }

  _onModalShow = () => {
    if (!this.props.preDefinedActivities) {
      this.props.getAllActivities();
    }
    this.setState({  
      selectedItem: this.props.selectedActivity
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
    this.props.confirmHandler(this.props.locationId, activity);
  }

  _onSave = () => {
    this.props.confirmHandler(this.props.locationId, this.state.selectedItem);
  }

  render() {
    const { isVisible, preDefinedActivities, selectedActivity } = this.props;
    console.log('selected acvitiy: ' + JSON.stringify(selectedActivity));
    var contentElement = preDefinedActivities
          ? <ActivityContainerComponent
              items={preDefinedActivities}
              selectedItem={selectedActivity}
              onConfirmHandler={this._onConfirm}
              removeSelectedActivityHandler={this._removeSelectedActivity}>
            </ActivityContainerComponent>
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
                      >{getLabel("trip_detail.activity_modal_title")}
                  </Text>
                  <TouchableOpacity onPress={this._onSave} style={styles.saveButtonContainer}>
                      <Icon name="md-checkmark" type="Ionicons" style={styles.saveButtonIcon}></Icon>
                  </TouchableOpacity>
                </View>
                <View style={styles.activityContainer}>
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
  activityIcon: TextStyle;
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
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#DADADA",
    marginBottom: 15
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
  activityContainer: {
    flex: 1
  },
  activityPreDefinedContainer: {
    flex: 1
  },
  activityPreDefinedFlatList: {
    flex: 1,
    marginVertical: 20
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
  
const AddActivityModalStyle = connectStyle<typeof AddActivityModalComponent>('NativeBase.Modal', styles)(AddActivityModalComponent);

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
  let dateVm = storeState.currentTrip.dates.find(item => item.dateIdx == ownProps.dateIdx);
  let activity = null;

  if (dateVm) {
    let location = dateVm.locations.find(item => item.locationId == ownProps.locationId);
    activity = location && location.activity ? location.activity : activity;
  }

  return {
      preDefinedActivities: storeState.dataSource.activities,
      selectedActivity: activity
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
)(AddActivityModalStyle);

export default AddActivityModal;
