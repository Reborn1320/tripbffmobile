//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Button, Icon, Toast } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import { connect } from "react-redux";
import { getAllActivities } from "../../../store/DataSource/operations";
import { StoreData } from "../../../store/Interfaces";
import { getLabel } from "../../../../i18n";
import { SearchBar } from 'react-native-elements';
import uuid4 from 'uuid/v4';

class SelectedActivityItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}       
          style={styles.activityItemContainer}>
          <View style={styles.activityItem}>          
            <Text>{this.props.item.label}</Text>   
            <Icon name='trash-alt' type="FontAwesome5" style={{fontSize: 20, marginLeft: 10}}/>           
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
      <TouchableOpacity onPress={this._onPress} style={styles.activityItemContainer}>
        <View style={styles.activityItem}>
          <Icon style={{ marginRight: 5}} type="FontAwesome5" name={this.props.icon} />  
          <Text>{this.props.label}</Text>
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
          filterItems = filterItems.filter(item => item.activityId != this.state.newDefinedItem.activityId);

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
          selectedItem.activityId = uuid4();

      this.setState({
        preDefinedItems: this.props.items,
        selectedItem: null,
        newDefinedItem: null,
        search: ''
      });
      this.props.onConfirmHandler(selectedItem);
    }   
  }

  _keyExtractor = (item, index) => item.activityId;

  _renderItem = ({item}) => (
      <ActivityItem
        id={item.activityId}
        label={item.label}
        icon={item.icon}
        onPressItem={this._onConfirm}
      />
    );

  render() {
    return (
      <View style={{flex: 1}}>
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
             <SearchBar
               placeholder={getLabel("action.search")}
               onChangeText={this._updateSearch}
               value={this.state.search}
             />
         </View>
         <View style={{flex: 1}}>
           <FlatList keyboardShouldPersistTaps={'handled'}            
             style={{flex: 1, marginVertical: 20}}
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
  selectedItem: null
}

class AddActivityModalComponent extends React.PureComponent<Props & IMapDispatchToProps, State> {
  constructor(props: Props & IMapDispatchToProps) {
    super(props);  
  }

  _onModalShow = () => {
    if (!this.props.preDefinedActivities) {
      this.props.getAllActivities();
    }
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
                    <Button transparent onPress={this._onCancel}><Text>{getLabel("action.cancel")}</Text></Button>
                    <Button transparent onPress={this._onSave}><Text>{getLabel("action.save")}</Text></Button>
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
  modalInnerContainer: ViewStyle;
  activityContainer: ViewStyle;
  activityItemContainer: ViewStyle;
  activityItem: ViewStyle;
  iconRemoved: ViewStyle;
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
    justifyContent: "space-between"
  },
  modalInnerContainer: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  activityContainer: {
    flex: 1
  },
  activityItemContainer: {
    width: Dimensions.get('window').width / 2,
    height: 40,
    borderRadius: 4,
    borderWidth: 0.2,
    borderColor: '#d6d7da'
  },
  activityItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center"
  },
  iconRemoved: {
    
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
