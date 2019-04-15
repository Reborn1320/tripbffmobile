import * as React from "react";
import { View, Text, Button, Icon } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import { connect } from "react-redux";
import { getAllHighlights } from "../../store/DataSource/operations";
import { StoreData } from "../../store/Interfaces";

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
      <TouchableOpacity onPress={this._onPress}>
        <View style={{flex: 1, flexDirection: "row", justifyContent: 'flex-start'}}>
          <Icon style={{ marginRight: 5}} type="FontAwesome5" name={this.props.icon} />  
          <Text>{this.props.label}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class AddHighlightModalComponent extends React.Component<Props & IMapDispatchToProps, State> {
  constructor(props: Props & IMapDispatchToProps) {
    super(props);  
  }

  componentDidMount() {
    this.props.getAllHighlights();
  }

  _onCancel = () => {
    this.props.cancelHandler();
  };

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

    _renderContent() {
        return (
          <FlatList
              style={{flex: 1, marginVertical: 20}}
              data={this.props.preDefinedHighlights}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              numColumns={2}
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
                <View style={{ flex: 1 }}>
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
  placesContainer: ViewStyle;
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalInnerContainer: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  placesContainer: {
    flex: 6
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
