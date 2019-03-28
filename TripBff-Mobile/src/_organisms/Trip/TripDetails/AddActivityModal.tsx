//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Button, Icon } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import { connect } from "react-redux";
import { getAllActivities } from "../../../store/DataSource/operations";
import { StoreData } from "../../../store/Interfaces";

interface IMapDispatchToProps {
  getAllActivities: () => Promise<StoreData.ActivityVM>
}

export interface Props {
  isVisible: boolean;
  locationId: string;
  preDefinedActivities?: Array<StoreData.PreDefinedActivityVM>
  confirmHandler: (locationId, activity) => void;
  cancelHandler?: () => void;
}

interface State {
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
      <TouchableOpacity onPress={this._onPress}>
        <View style={{flex: 1, flexDirection: "row", justifyContent: 'flex-start'}}>
          <Icon style={{ marginRight: 5}} type="FontAwesome5" name={this.props.icon} />  
          <Text>{this.props.label}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class AddActivityModalComponent extends React.Component<Props & IMapDispatchToProps, State> {
  constructor(props: Props & IMapDispatchToProps) {
    super(props);  
  }

  componentDidMount() {
    this.props.getAllActivities();
  }

  _onCancel = () => {
    if (this.props.cancelHandler) {
      this.props.cancelHandler();
    }
  };

  _onConfirm(activity) { 
    this.props.confirmHandler(this.props.locationId, activity);
  }

  _keyExtractor = (item, index) => item.activityId;

  _renderItem = ({item}) => (
      <ActivityItem
        id={item.activityId}
        label={item.label}
        icon={item.icon}
        onPressItem={(item) => this._onConfirm(item)}
      />
    );

    _renderContent() {
        return (
          <FlatList
              style={{flex: 1, marginVertical: 20}}
              data={this.props.preDefinedActivities}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              numColumns={2}
            />
        );
    }

  render() {
    const { isVisible } = this.props;
    var contentElement = this.props.preDefinedActivities
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
  
const AddActivityModalStyle = connectStyle<typeof AddActivityModalComponent>('NativeBase.Modal', styles)(AddActivityModalComponent);

const mapStateToProps = (storeState, ownProps: Props) => {
  return {
      preDefinedActivities: storeState.dataSource.activities
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
