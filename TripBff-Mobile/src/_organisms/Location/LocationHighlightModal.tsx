import * as React from "react";
import { View, Text, Button, Icon } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import { connect } from "react-redux";
import { getAllHighlights } from "../../store/DataSource/operations";
import { StoreData } from "../../store/Interfaces";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SearchBar } from 'react-native-elements';

interface IMapDispatchToProps {
    getAllHighlights: () => Promise<StoreData.PreDefinedHighlightVM>
}

export interface Props {
  isVisible: boolean;
  preDefinedHighlights?: Array<StoreData.PreDefinedHighlightVM>
  confirmHandler: () => void;
  cancelHandler?: () => void;
}

interface State {
  index: number,
  routes: Array<any>,
}

class HighlightItem extends React.PureComponent<any> {
   _onPress = () => {
    // this.props.onPressItem({
    //   feelingId: this.props.id,
    //   label: this.props.label,
    //   icon: this.props.icon
    // });
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}       
        style={styles.highlightItemContainer}>
        <View style={styles.highlightItem}>
          <Icon style={{ marginRight: 5}} type="FontAwesome5" name={this.props.icon} />  
          <Text>{this.props.label}</Text>
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
      newDefinedItem: {}
    }
  }

  componentDidMount() {
    this.setState({ preDefinedItems: this.props.items});
  }

  _onConfirm(highlight) { 
    //this.props.confirmHandler(this.props.locationId, feeling);
  }

  _keyExtractor = (item, index) => item.highlightId;

  _renderItem = ({item}) => (
    <HighlightItem
      id={item.highlightId}
      label={item.label}
      type={item.type}
      onPressItem={(item) => this._onConfirm(item)}
    />
  );

  updateSearch = search => {
    var filterItems = this.props.items;
    var newItem = {};

    if (search) {
      var searchLower = search.toLowerCase();
      filterItems = filterItems.filter(item => item.label.toLowerCase().includes(searchLower));

      if (this.state.newDefinedItem)
        filterItems = filterItems.filter(item => item.highlightId != this.state.newDefinedItem.highlightId);

      var exactItem = filterItems.find(item => item.label.toLowerCase() == searchLower);

      if (!exactItem) {
        var lastPredefinedItem = this.props.items.slice(-1);
        newItem = {
          highlightId: -(lastPredefinedItem.highlightId),
          label: search,
          type: lastPredefinedItem.type
        };
        filterItems.push(newItem); 
      }     
    }
    
    this.setState({ preDefinedItems: filterItems, search: search, newDefinedItem: newItem });
  };


  render() {
    
    return (
       <View style={this.props.styles}>
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

class AddHighlightModalComponent extends React.Component<Props & IMapDispatchToProps, State> {
  constructor(props: Props & IMapDispatchToProps) {
    super(props);  
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'Like' },
        { key: 'second', title: 'Dislike' },
      ],
    }
  }

  componentDidMount() {
    this.props.getAllHighlights();
  }

  _onCancel = () => {
    this.props.cancelHandler();
  };

  _renderContent() {
    const likePreDefinedItems = this.props.preDefinedHighlights.filter(item =>  item.type == "Like" );
    const dislikePreDefinedItems = this.props.preDefinedHighlights.filter(item => item.type == "Dislike" );

    return (
        <TabView
          navigationState={this.state}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'first':
                return <TabHighlightComponent items={likePreDefinedItems} styles={styles.tabScene} />;
              case 'second':
                return <TabHighlightComponent items={dislikePreDefinedItems} styles={styles.tabScene} />;
              default:
                return null;
            }
          }}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
    );
  }

  render() {
    const { isVisible } = this.props;
    var contentElement = this.props.preDefinedHighlights
          ? this._renderContent() 
          : <ActivityIndicator size="small" color="#00ff00" />
          
    return (
        <RNModal style={styles.modal} 
            isVisible={isVisible} hideModalContentWhileAnimating>
            <View style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                    <Button transparent onPress={this._onCancel}><Text>Cancel</Text></Button>
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
    justifyContent: 'flex-start',
    alignItems: "center"
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
