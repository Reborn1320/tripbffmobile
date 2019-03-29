//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { Modal } from "../_atoms";
import { View, Text, Button, H2 } from "native-base";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import variables from "../theme/variables/material";
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

  _onCancel = () => {
    if (this.props.cancelHandler) {
      this.props.cancelHandler();
    }
  };
  _onConfirm = () => this.props.confirmHandler();

  render() {
    const { isVisible, title, content } = this.props;

    return (
      <Modal isVisible={isVisible}>
        <View style={styles.modalInnerContainer}>
          <View style={styles.titleContainer}>
            <H2 style={styles.titleText}>{title}</H2>
          </View>
          <Text style={styles.contentText}>{content}</Text>
          <View style={styles.buttons}>
            <Button transparent onPress={this._onCancel}><Text>Cancel</Text></Button>
            <Button onPress={this._onConfirm}><Text>Yes</Text></Button>
          </View>
        </View>
      </Modal>
    );
  }
}

interface Style {
  buttons: ViewStyle;
  // modalContainer: ViewStyle;
  modalInnerContainer: ViewStyle;
  titleContainer: ViewStyle;
  titleText: TextStyle;
  contentText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  // modalContainer: {
  //   ...mixins.themes.debug,
  // },
  modalInnerContainer: {
    width: "100%",
    height: 200,
    paddingBottom: 15,
    // ...mixins.themes.debug1,
  },
  titleContainer: {
    margin: 0,
    paddingTop: 22,
    paddingBottom: 10,
    borderBottomColor: variables.listBorderColor,
    borderBottomWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    width: "100%",
    // ...mixins.themes.debug,
  },
  titleText: {
    color: variables.listBorderColor,
  },
  contentText: {
    marginTop: 22,
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
    color: variables.listBorderColor
  }
})

export default ConfirmationModal;
