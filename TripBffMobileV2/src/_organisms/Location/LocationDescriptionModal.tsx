import * as React from "react";
import { View, Text, Button, Icon } from "native-base";
import { StyleSheet, ViewStyle, TextInput, Keyboard } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import { getLabel } from "../../../i18n";

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
          
    return (
        <RNModal style={styles.modal} 
            isVisible={isVisible} hideModalContentWhileAnimating>
            <View style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                    <Button transparent onPress={this._onCancel}><Text>{getLabel("action.cancel")}</Text></Button>
                    <Button transparent onPress={this._onSave}><Text>{getLabel("action.save")}</Text></Button>
                </View>
                <View style={styles.modalContentContainer}>
                    <TextInput
                            placeholder = {getLabel("location_detail.description_placeholder")}
                            multiline = {true}                        
                            numberOfLines = {15}
                            textAlignVertical = "top"
                            editable = {true}
                            value={this.state.description}
                            onChangeText={this._updateLocationDescription}
                            style={[styles.textInput, { fontSize: 18 }]}
                        />
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
  textInput: ViewStyle;
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
  textInput: {
    borderRadius: 8,
    borderWidth: 0.2,
    borderColor: '#d6d7da',
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingTop: 10
  }
})
  
const UpdateLocationDescriptionModal = 
    connectStyle<typeof UpdateLocationDescriptionComponent>('NativeBase.Modal', styles)(UpdateLocationDescriptionComponent);

export default UpdateLocationDescriptionModal;
