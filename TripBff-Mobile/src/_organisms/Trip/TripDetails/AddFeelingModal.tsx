//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Button, Icon } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import  Autocomplete  from "react-native-autocomplete-input";
const mbxClient = require('@mapbox/mapbox-sdk');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const baseClient = mbxClient({ accessToken: 'pk.eyJ1IjoidHJpcGJmZiIsImEiOiJjanFtZHA3b2cxNXhmNDJvMm5tNHR4bTFpIn0.QKKFlCG0G5sEHIss1n-A8g' });
const geoCodingService = mbxGeocoding(baseClient);
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment";
import { connect } from "react-redux";
import { getAllFeelings } from "../../../store/DataSource/operations";
import { StoreData } from "../../../store/Interfaces";

interface IMapDispatchToProps {
  getAllFeelings: () => Promise<StoreData.FeelingVM>
}

export interface Props {
  isVisible: boolean;
  locationId: string;
  preDefinedFeelings?: Array<StoreData.PreDefinedFeelingVM>
  confirmHandler: (locationId, feeling) => void;
  cancelHandler?: () => void;
}

interface State {
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
      <TouchableOpacity onPress={this._onPress}>
        <View style={{flex: 1, flexDirection: "row", justifyContent: 'flex-start'}}>
          <Icon style={{ marginRight: 5}} type="FontAwesome5" name={this.props.icon} />  
          <Text>{this.props.label}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class AddFeelingModalComponent extends React.Component<Props & IMapDispatchToProps, State> {
  constructor(props: Props & IMapDispatchToProps) {
    super(props);  
  }

  componentDidMount() {
    this.props.getAllFeelings();
  }

  _onCancel = () => {
    if (this.props.cancelHandler) {
      this.props.cancelHandler();
    }
  };

  _onConfirm(feeling) { 
    this.props.confirmHandler(this.props.locationId, feeling);
  }

  _keyExtractor = (item, index) => item.feelingId;

  _renderItem = ({item}) => (
      <FeelingItem
        id={item.feelingId}
        label={item.label}
        icon={item.icon}
        onPressItem={(item) => this._onConfirm(item)}
      />
    );

    _renderContent() {
        return (
          <FlatList
              style={{flex: 1, marginVertical: 20}}
              data={this.props.preDefinedFeelings}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              numColumns={2}
            />
        );
    }

  render() {
    const { isVisible } = this.props;
    var contentElement = this.props.preDefinedFeelings
          ? this._renderContent() 
          : <ActivityIndicator size="small" color="#00ff00" />
          
    return (
        <RNModal style={styles.modal} 
            isVisible={isVisible} hideModalContentWhileAnimating>
            <View style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                    <Button transparent onPress={this._onCancel}><Text>Cancel</Text></Button>
                    <Button transparent onPress={this._onConfirm}><Text>Done</Text></Button>
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
  
const AddFeelingModalStyle = connectStyle<typeof AddFeelingModalComponent>('NativeBase.Modal', styles)(AddFeelingModalComponent);

const mapStateToProps = (storeState, ownProps: Props) => {
  return {
      preDefinedFeelings: storeState.dataSource.feelings
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
