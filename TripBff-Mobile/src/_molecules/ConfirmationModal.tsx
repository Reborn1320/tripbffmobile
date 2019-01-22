//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import Modal from "../_atoms/Modal";
import { View, Text, Button } from "native-base";
import { TouchableOpacity } from "react-native";

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
        <View style={{ flex: 1 }}>
            <Text>{title}</Text>
            <Text>{content}</Text>
            <View>
              <Button transparent onPress={this._onCancel}>Cancel</Button>
              <Button onPress={this._onConfirm}>Yes</Button>
            </View>
          </View>
      </Modal>
    );
  }
}

export default ConfirmationModal;
