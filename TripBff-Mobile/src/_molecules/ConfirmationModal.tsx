//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import Modal from "../_atoms/Modal";
import { View, Text, Button  } from "native-base";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";

export interface Props {
  isVisible: boolean;
  title?: string;
  content: string;
  confirmHandler: () => void;
  cancelHandler?: () => void;
}

interface State {
}

class ConfirmationModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  _onCancel = () => this.props.cancelHandler();
  _onConfirm = () => this.props.confirmHandler();

  render() {
    const { isVisible, title, content } = this.props;

    return (
      <Modal isVisible={isVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.titleContent}>{title}</Text>
            <Text style={styles.textContent}>{content}</Text>
            <View style={styles.buttons}>
              <Button transparent onPress={this._onCancel}><Text>Cancel</Text></Button>
              <Button onPress={this._onConfirm}><Text>Yes</Text></Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

interface Style {
  buttons: ViewStyle;
  modalContainer: ViewStyle;
  modalContent: ViewStyle;
  titleContent: TextStyle;
  textContent: TextStyle;
}

const styles = StyleSheet.create<Style>({
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  modalContainer: {
    flex: 0,
    height: 200,
  },
  modalContent: {
    padding: 22,
    height: 200
  },
  titleContent: {
    marginBottom: 10,
    color: "white"
  },
  textContent: {
    marginBottom: 10,
    color: "white"
  }
})

export default ConfirmationModal;
