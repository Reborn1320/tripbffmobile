//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Button, Icon } from "native-base";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import { connect } from "react-redux";
import { getAllActivities } from "../../../store/DataSource/operations";
import { StoreData } from "../../../store/Interfaces";
import { getLabel } from "../../../../i18n";

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
      <TouchableOpacity onPress={this._onPress} style={styles.activityItemContainer}>
        <View style={styles.activityItem}>
          <Icon style={{ marginRight: 5}} type="FontAwesome5" name={this.props.icon} />  
          <Text>{this.props.label}</Text>
        </View>
      </TouchableOpacity>
    );
  }
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
            onModalShow={this._onModalShow}
            isVisible={isVisible} hideModalContentWhileAnimating>
            <View style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                    <Button transparent onPress={this._onCancel}><Text>{getLabel("action.cancel")}</Text></Button>
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
