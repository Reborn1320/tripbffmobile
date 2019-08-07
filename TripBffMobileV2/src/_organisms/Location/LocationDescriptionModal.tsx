import * as React from "react";
import { View, Text, Button, Icon } from "native-base";
import { StyleSheet, ViewStyle, TextInput, Keyboard, TextStyle } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import { getLabel } from "../../../i18n";
import ActionModal from "../../_molecules/ActionModal";
import { mixins } from "../../_utils";

export interface Props {
  isVisible: boolean;
  description: string,
  confirmHandler: (description: string) => void;
  cancelHandler: () => void;
}

interface State {
  description: string
}

class UpdateLocationDescriptionComponent extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);  

    this.state = {
      description: this.props.description
    }
  }

  _updateLocationDescription = (description) => {
    this.setState({
        description: description
    });
  }

  _onCancel = () => {
    this.props.cancelHandler();
  };

  _onSave = () => {
    Keyboard.dismiss();
    this.props.confirmHandler(this.state.description);
  }

  render() {
    const { isVisible } = this.props;
    var contentElement = (
      <View style={styles.modalContentContainer}>
          <TextInput
                  placeholder = {getLabel("location_detail.description_placeholder")}
                  multiline = {true}                        
                  numberOfLines = {10}
                  textAlignVertical = "top"
                  editable = {true}
                  value={this.state.description}
                  onChangeText={this._updateLocationDescription}
                  style={styles.textInput}
              />
      </View>    
    );
          
    return (
        <ActionModal
          title={getLabel("location_detail.update_description_title")}
          isVisible={isVisible}
          onCancelHandler={this._onCancel}
          onConfirmHandler={this._onSave}>
          {contentElement}
        </ActionModal>
    );
  }
}

interface Style {
  modal: ViewStyle,
  buttons: ViewStyle;
  modalInnerContainer: ViewStyle;
  modalContentContainer: ViewStyle;
  textInput: TextStyle;
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
    flex: 1,
    marginTop: 20
  },
  textInput: {
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: '#DADADA',
    marginLeft: 12,
    marginRight: 15,
    paddingLeft: 15,
    paddingTop: 12,
    ...mixins.themes.fontNormal,
    fontSize: 16,
    lineHeight: 18,
    color: "#383838"
  }
})
  
const UpdateLocationDescriptionModal = 
    connectStyle<typeof UpdateLocationDescriptionComponent>('NativeBase.Modal', styles)(UpdateLocationDescriptionComponent);

export default UpdateLocationDescriptionModal;
