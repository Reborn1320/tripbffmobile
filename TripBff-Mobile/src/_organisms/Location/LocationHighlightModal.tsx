import * as React from "react";
import { View, Text, Button, Icon } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import { connect } from "react-redux";
import { getAllHighlights } from "../../store/DataSource/operations";
import { StoreData } from "../../store/Interfaces";
import { TabView } from 'react-native-tab-view';
import { SearchBar } from 'react-native-elements';

class SelectedHighlightItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}       
          style={styles.highlightItemContainer}>
          <View style={styles.highlightItem}>          
            <Text>{this.props.item.label}</Text>   
            <Icon name='trash-alt' type="FontAwesome5" style={{fontSize: 20, marginLeft: 10}}/>           
          </View>
      </TouchableOpacity>
    );
  }
}

class HighlightItem extends React.PureComponent<any> {
   _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}       
          style={styles.highlightItemContainer}>
          <View style={styles.highlightItem}>          
            <Text>{this.props.item.label}</Text>               
          </View>
      </TouchableOpacity>
    );
  }
}

class TabHighlightComponent extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      preDefinedItems: [],
      newDefinedItem: null,
      selectedItems: []
    }
  }

  componentDidMount() {
    this.setState({
      preDefinedItems: this.props.items.filter(item => !this.props.selectedItems.includes(item)),
      selectedItems: this.props.selectedItems
    });
  }

  updateSearch = search => {
    var filterItems = this.props.items.filter(item => !this.state.selectedItems.includes(item));
    var newItem = null;

    if (search) {
      var searchLower = search.toLowerCase();
      filterItems = filterItems.filter(item => item.label.toLowerCase().includes(searchLower));

      if (this.state.newDefinedItem)
        filterItems = filterItems.filter(item => item.highlightId != this.state.newDefinedItem.highlightId);

      var exactItem = filterItems.find(item => item.label.toLowerCase() == searchLower);

      if (!exactItem) {
        var lastPredefinedItem = this.props.items.slice(-1);

        newItem = {          
          highlightId: lastPredefinedItem[0].highlightId + 1000000,
          label: search,
          highlightType: lastPredefinedItem[0].highlightType
        };
        filterItems.push(newItem);         
      }     
    }
    
    this.setState({ preDefinedItems: filterItems, search: search, newDefinedItem: newItem });
  };

  _onConfirm = (selectedItem) => {
    var selectedItems = [...this.state.selectedItems, selectedItem];
    this.setState({
      preDefinedItems: this.props.items.filter(item => !selectedItems.includes(item)),
      selectedItems: selectedItems,
      newDefinedItem: {},
      search: ''
    });
    this.props.addSelectedHighlights(selectedItem);
  }

  _onDeselectConfirm = (deSelectedItem) => {
    var selectedItems = this.state.selectedItems.filter(item => item.highlightId != deSelectedItem.highlightId);
    var existedPreDefinedItem = this.props.items.find(item => item.highlightId == deSelectedItem.highlightId);
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
      selectedItems: selectedItems
    });
    this.props.removeSelectedHighlights(deSelectedItem);
  }

  _keySelectedExtractor = (item, index) => item.highlightId;

  _renderSelectedItem = ({item}) => (
    <SelectedHighlightItem
      item={item}
      onPressItem={this._onDeselectConfirm}
    />
  );

  _keyExtractor = (item, index) => item.highlightId;

  _renderItem = ({item}) => (
    <HighlightItem
      item={item}
      onPressItem={this._onConfirm}
    />
  );
  
  render() {       
    return (
       <View style={this.props.styles}>
           <View>
            <FlatList             
                style={{marginVertical: 20}}
                data={this.state.selectedItems}
                keyExtractor={this._keySelectedExtractor}
                renderItem={this._renderSelectedItem}
                numColumns={2}
              />
           </View>
           <View>
              <SearchBar
                placeholder="Search"
                onChangeText={this.updateSearch}
                value={this.state.search}
              />
          </View>
          <View style={{flex: 1}}>
            <FlatList             
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

class AddHighlightModalContentComponent extends React.PureComponent<any, any> {

  constructor(props: Props & IMapDispatchToProps) {
    super(props);  
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'Like' },
        { key: 'second', title: 'Dislike' },
      ]
    }
  }

  _addSelectedHighlights = (item) => {    
      this.props.addSelectedHighlights(item);
  }

  _removeSelectedHighlights = (deSelectedItem) => {
    this.props.removeSelectedHighlights(deSelectedItem);
  }

  render() {
    const likePreDefinedItems = this.props.preDefinedHighlights.filter(item =>  item.highlightType == "Like" );
    const dislikePreDefinedItems = this.props.preDefinedHighlights.filter(item => item.highlightType == "Dislike" );

    let likeHighlightItems = [];
    let disLikeHighlightItems = [];

    if (this.props.selectedHighlightItems && this.props.selectedHighlightItems.length > 0) {
      var selectedHighlights = this.props.preDefinedHighlights.filter(item => {
          let selectedHighlight = this.props.selectedHighlightItems.find(selectedItem => selectedItem.highlightId == item.highlightId);

          if (selectedHighlight)
              return true;
          return false;
      });
      likeHighlightItems = selectedHighlights.filter(item =>  item.highlightType == "Like" );
      disLikeHighlightItems = selectedHighlights.filter(item =>  item.highlightType == "Dislike" );
    }

    return (
      <TabView
        navigationState={this.state}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'first':
              return <TabHighlightComponent items={likePreDefinedItems}
                                            selectedItems={likeHighlightItems}
                                            addSelectedHighlights={this._addSelectedHighlights} 
                                            removeSelectedHighlights={this._removeSelectedHighlights}
                                            styles={styles.tabScene} />;
            case 'second':
              return <TabHighlightComponent items={dislikePreDefinedItems}
                                            selectedItems={disLikeHighlightItems}
                                            addSelectedHighlights={this._addSelectedHighlights} 
                                            removeSelectedHighlights={this._removeSelectedHighlights}
                                            styles={styles.tabScene} />;
            default:
              return null;
          }
        }}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
  );
  }
}

interface IMapDispatchToProps {
  getAllHighlights: () => Promise<StoreData.PreDefinedHighlightVM>
}

export interface Props {
  isVisible: boolean;
  preDefinedHighlights?: Array<StoreData.PreDefinedHighlightVM>,
  likeItems: Array<StoreData.LocationLikeItemVM>,
  confirmHandler: (highlights: Array<StoreData.LocationLikeItemVM>) => void;
  cancelHandler?: () => void;
}

interface State {
  selectedHighlights: Array<StoreData.LocationLikeItemVM>
}

class AddHighlightModalComponent extends React.PureComponent<Props & IMapDispatchToProps, State> {
  constructor(props: Props & IMapDispatchToProps) {
    super(props);  
    this.state = {
      selectedHighlights: []
    }
  }

  componentDidMount() {
    if (this.props.likeItems && this.props.likeItems.length > 0) {
      this.setState({
        selectedHighlights: [...this.props.likeItems]
      });
    }
  }

  _onModalWillShow = () => {
    if (!this.props.preDefinedHighlights) {
      this.props.getAllHighlights();
    }
  }

  _onCancel = () => {
    this.props.cancelHandler();
  };

  _onSave = () => {
    this.props.confirmHandler(this.state.selectedHighlights);
  }

  _addSelectedHighlights = (item) => {    
    this.setState({
      selectedHighlights: [...this.state.selectedHighlights, item]
    });
  }

  _removeSelectedHighlights = (deSelectedItem) => {
    this.setState({
      selectedHighlights: this.state.selectedHighlights.filter(item => item.highlightId != deSelectedItem.highlightId)
    });
  }

  render() {
    const { isVisible } = this.props;
    var contentElement = this.props.preDefinedHighlights
          ? <AddHighlightModalContentComponent
              preDefinedHighlights={this.props.preDefinedHighlights}
              selectedHighlightItems={this.props.likeItems}
              addSelectedHighlights={this._addSelectedHighlights}
              removeSelectedHighlights={this._removeSelectedHighlights}>            
          </AddHighlightModalContentComponent>
          : <ActivityIndicator size="small" color="#00ff00" />
          
    return (
        <RNModal style={styles.modal} 
            onModalShow={this._onModalWillShow}
            isVisible={isVisible} hideModalContentWhileAnimating>
            <View style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                    <Button transparent onPress={this._onCancel}><Text>Cancel</Text></Button>
                    <Button transparent onPress={this._onSave}><Text>Save</Text></Button>
                </View>
                <View style={styles.modalContentContainer}>
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
  modalContentContainer: ViewStyle;
  tabScene: ViewStyle;
  highlightItemContainer: ViewStyle;
  highlightItem: ViewStyle;
  highlightContentContainer: ViewStyle;
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
  modalContentContainer: {
    flex: 1
  },
  tabScene: {
    flex: 1,
  },
  highlightContentContainer: {
    flexDirection:"row",
    justifyContent: "space-between",
    flexWrap: 'wrap'
  },
  highlightItemContainer: {
    width: Dimensions.get('window').width / 2,
    height: 40,
    borderRadius: 4,
    borderWidth: 0.2,
    borderColor: '#d6d7da'
  },
  highlightItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center"
  },
  iconRemoved: {
    
  }
})
  
const AddHighlightModalStyle = connectStyle<typeof AddHighlightModalComponent>('NativeBase.Modal', styles)(AddHighlightModalComponent);

const mapStateToProps = (storeState, ownProps: Props) => {
  return {
      preDefinedHighlights: storeState.dataSource.highlights
  };
};

const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
  return {
    getAllHighlights: () => dispatch(getAllHighlights())
  };
};

const AddHighlightModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddHighlightModalStyle);

export default AddHighlightModal;
