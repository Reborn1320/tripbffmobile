import * as React from "react";
import { View, Text, Icon, Toast, Root } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, 
  ActivityIndicator, Dimensions, TextStyle } from "react-native";
import { connectStyle } from 'native-base';
import { connect } from "react-redux";
import { getAllHighlights } from "../../store/DataSource/operations";
import { StoreData } from "../../store/Interfaces";
import { TabView } from 'react-native-tab-view';
import uuid4 from 'uuid/v4';
import ActionModal from "../../_molecules/ActionModal";
import TabBarComponent from "../../_atoms/TabBar";
import SearchBarComponent from "../../_atoms/SearchBarComponent";
import { mixins } from "../../_utils";
import  NBColor from "../../theme/variables/commonColor.js";
import { createLabelLocales } from "../../_function/commonFunc";
import { PropsBase } from "../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";
import Flurry from 'react-native-flurry-sdk';

class SelectedHighlightItem extends React.PureComponent<any> {
  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    let textColor = this.props.item.highlightType == "Like" ? NBColor.brandPrimary : NBColor.brandDanger;

    return (
      <TouchableOpacity onPress={this._onPress}       
          style={styles.highlightItemContainer}>
          <View style={styles.highlightItem}>
            <View style={styles.highlightNameSelectedContainer}>
              <Text numberOfLines={1} style={{color: textColor}}>{this.props.item["label_" + this.props.locale]}</Text>   
            </View>       
            <Icon name='md-close' type="Ionicons" style={[styles.iconRemoved, {color: textColor}]}/>           
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
            <Text>{this.props.item["label_" + this.props.locale]}</Text>               
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
      preDefinedItems: this.props.items.filter(item => !this.props.selectedItems.find(se => se.highlightId == item.highlightId)),
      selectedItems: this.props.selectedItems
    });
  }

  updateSearch = search => {
    var filterItems = this.props.items.filter(item => !this.state.selectedItems.find(se => se.highlightId == item.highlightId));
    var newItem = null;

    if (search) {
      let numberOfCharacters = search.length;

      if (numberOfCharacters > 20) {
        Toast.show({
            text: this.props.t("location_detail:user_defined_like_dislike_warning"),
            buttonText: "Okay",
            textStyle: {
              ...mixins.themes.fontNormal
            },
            buttonTextStyle: {
              ...mixins.themes.fontNormal
            },
            position: "top",
            type: "warning",
            duration: 5000
        });
      }
      else {
        var searchLower = search.toLowerCase();
            filterItems = filterItems.filter(item => item["label_" + this.props.locale].toLowerCase().includes(searchLower));

        if (this.state.newDefinedItem)
          filterItems = filterItems.filter(item => item.highlightId != this.state.newDefinedItem.highlightId);

        var exactItem = filterItems.find(item => item["label_" + this.props.locale].toLowerCase() == searchLower);

        if (!exactItem) {
          var lastPredefinedItem = this.props.items.slice(-1);
          newItem = createLabelLocales(search);
          newItem.highlightType = lastPredefinedItem[0].highlightType;         
          filterItems.push(newItem);         
        }     
      }      
    }
    
    this.setState({ preDefinedItems: filterItems, search: search, newDefinedItem: newItem });
  };

  _onConfirm = (selectedItem) => {
    let numberOfCharacters = selectedItem["label_" + this.props.locale].length;

    if (numberOfCharacters > 20) {
      Toast.show({
          text: this.props.t("location_detail:user_defined_like_dislike_warning"),
          buttonText: "Okay",
          textStyle: {
            ...mixins.themes.fontNormal
          },
          buttonTextStyle: {
            ...mixins.themes.fontNormal
          },
          position: "top",
          type: "warning",
          duration: 5000
      });
    }
    else {
      if (this.state.newDefinedItem)
        selectedItem.highlightId = uuid4();

      var selectedItems = [...this.state.selectedItems, selectedItem];
      this.setState({
        preDefinedItems: this.props.items.filter(item => !selectedItems.find(se => se.highlightId == item.highlightId)),
        selectedItems: selectedItems,
        newDefinedItem: null,
        search: ''
      });
      this.props.addSelectedHighlights(selectedItem);
    }   
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
      preDefinedItems = preDefinedItems.filter(item => item["label_" + this.props.locale].toLowerCase().includes(searchLower));
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
      locale={this.props.locale}
    />
  );

  _keyExtractor = (item, index) => item["label_en"];

  _renderItem = ({item}) => (
    <HighlightItem
      item={item}
      onPressItem={this._onConfirm}
      locale={this.props.locale}
    />
  );
  
  render() {       
    return (
       <View style={this.props.styles}>
           <View style={styles.searchBarContainer}>
             <SearchBarComponent updateSearch={this.updateSearch}></SearchBarComponent>  
          </View>

           <View>
             {
               this.state.selectedItems && this.state.selectedItems.length > 0 &&
               <FlatList keyboardShouldPersistTaps={'handled'}            
                  style={styles.selectedItemContainer}
                  data={this.state.selectedItems}
                  keyExtractor={this._keySelectedExtractor}
                  renderItem={this._renderSelectedItem}
                  numColumns={2}
                />
             }              
           </View>

          <View style={styles.preDefinedItemContainer}>
            <FlatList keyboardShouldPersistTaps={'handled'}            
              style={{flex: 1}}
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

interface ModalState {
  index: number,
  routes: any
}

class AddHighlightModalContentComponent extends React.PureComponent<any, ModalState> {

  constructor(props) {
    super(props);  
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: this.props.t("location_detail:like_label") },
        { key: 'second', title: this.props.t("location_detail:dislike_label")  },
      ]
    }
  }

  _addSelectedHighlights = (item) => {    
      this.props.addSelectedHighlights(item);
  }

  _removeSelectedHighlights = (deSelectedItem) => {
    this.props.removeSelectedHighlights(deSelectedItem);
  }

  private _renderTabBar = (props) => {
    return (
      <TabBarComponent tabProps={props}></TabBarComponent>
    )
  }

  render() {
    let likePreDefinedItems = this.props.preDefinedHighlights.filter(item =>  item.highlightType == "Like" );
    let dislikePreDefinedItems = this.props.preDefinedHighlights.filter(item => item.highlightType == "Dislike" );
    let selectedLikeItems = [];
    let selectedDisLikeItems = [];

    if (this.props.selectedHighlightItems && this.props.selectedHighlightItems.length > 0) {
      selectedLikeItems = this.props.selectedHighlightItems.filter(item =>  item.highlightType == "Like" );
      selectedDisLikeItems = this.props.selectedHighlightItems.filter(item =>  item.highlightType == "Dislike" );
    }

    return (
      <Root>
          <TabView
        navigationState={this.state}
        renderTabBar={this._renderTabBar}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'first':
              return <TabHighlightComponent items={likePreDefinedItems}
                                            selectedItems={selectedLikeItems}
                                            addSelectedHighlights={this._addSelectedHighlights} 
                                            removeSelectedHighlights={this._removeSelectedHighlights}
                                            styles={styles.tabScene} 
                                            locale={this.props.locale}
                                            t={this.props.t}/>;
            case 'second':
              return <TabHighlightComponent items={dislikePreDefinedItems}
                                            selectedItems={selectedDisLikeItems}
                                            addSelectedHighlights={this._addSelectedHighlights} 
                                            removeSelectedHighlights={this._removeSelectedHighlights}
                                            styles={styles.tabScene}
                                            locale={this.props.locale} 
                                            t={this.props.t}/>;
            default:
              return null;
          }
        }}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
      </Root>      
  );
  }
}

interface IMapDispatchToProps {
  getAllHighlights: () => Promise<StoreData.PreDefinedHighlightVM>
}

export interface Props extends PropsBase {
  isVisible: boolean;
  preDefinedHighlights?: Array<StoreData.PreDefinedHighlightVM>,
  likeItems: Array<StoreData.LocationLikeItemVM>,
  locale?: string,
  confirmHandler: (highlights: Array<StoreData.LocationLikeItemVM>) => void;
  cancelHandler?: () => void;
}

interface State {
  selectedHighlights: Array<StoreData.LocationLikeItemVM>,
  isLoadedData: boolean
}

class AddHighlightModalComponent extends React.PureComponent<Props & IMapDispatchToProps, State> {
  constructor(props: Props & IMapDispatchToProps) {
    super(props);  
    this.state = {
      selectedHighlights: [],
      isLoadedData: false
    }
  }

  componentDidMount() {
    Flurry.logEvent('Location Details - Add Like/Dislike', null, true);

    if (this.props.likeItems && this.props.likeItems.length > 0) {
      this.setState({
        selectedHighlights: [...this.props.likeItems]
      });
    }
  }

  componentWillUnmount() {
    Flurry.endTimedEvent('Location Details - Add Like/Dislike');
  }

  _onModalWillShow = () => {
    if (!this.props.preDefinedHighlights) {
      this.props.getAllHighlights();
    }

    this.setState({
      isLoadedData: true
    })
  }

  _onModalHide = () => {
    this.setState({
      isLoadedData: false
    })
  }


  _onCancel = () => {
    this.props.cancelHandler();
  };

  _onSave = () => {
    Flurry.logEvent('Location Details - Added Like/Dislike');
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
    const { isVisible, t } = this.props;
    
    var contentElement = this.props.preDefinedHighlights && this.state.isLoadedData
          ? <AddHighlightModalContentComponent
              t={this.props.t}
              preDefinedHighlights={this.props.preDefinedHighlights}
              selectedHighlightItems={this.props.likeItems}
              addSelectedHighlights={this._addSelectedHighlights}
              removeSelectedHighlights={this._removeSelectedHighlights}
              locale={this.props.locale}>            
          </AddHighlightModalContentComponent>
          : <ActivityIndicator size="small" color="#00ff00" />
          
    return (
        <ActionModal
          title={t("location_detail:update_highlight_title")}
          isVisible={isVisible}
          onModalShowHandler={this._onModalWillShow}
          onModalHideHandler={this._onModalHide}
          onCancelHandler={this._onCancel}
          onConfirmHandler={this._onSave}>
          {contentElement}
        </ActionModal>
    );
  }
}

interface Style {  
  tabScene: ViewStyle;
  highlightItemContainer: ViewStyle;
  highlightItem: ViewStyle;
  highlightNameSelectedContainer: ViewStyle;
  iconRemoved: TextStyle;
  searchBarContainer: ViewStyle;
  selectedItemContainer: ViewStyle;
  preDefinedItemContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({  
  tabScene: {
    flex: 1,
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
  highlightNameSelectedContainer: {
    maxWidth: "75%"
  },
  iconRemoved: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 3,
    color: "#383838"
  },
  searchBarContainer: {
    marginTop: 12
  },
  selectedItemContainer: {
    marginTop: 20
  },
  preDefinedItemContainer: {
    flex: 1,
    marginTop: 20
  }
})
  
const AddHighlightModalStyle = connectStyle<typeof AddHighlightModalComponent>('NativeBase.Modal', styles)(AddHighlightModalComponent);

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  return {
      preDefinedHighlights: storeState.dataSource.highlights,
      locale: storeState.user.locale
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

export default withNamespaces(['location_detail'])(AddHighlightModal);
