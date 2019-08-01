//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { Modal } from "../_atoms";
import { View, Text, Button, H2, H3 } from "native-base";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import NBTheme from "../theme/variables/material";
import { getLabel } from "../../i18n";
import { mixins } from "../_utils";

export interface Props {
  isVisible: boolean;
  title?: string;
  content: string;
  confirmHandler: () => void;
  cancelHandler?: () => void;
}

interface State {
}

class ConfirmationModal extends React.PureComponent<Props, State> {
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
            <H3 style={styles.titleText}>{title}</H3>
          </View>
          <Text style={styles.contentText}>{content}</Text>
          <View style={styles.buttons}>
            <Button transparent info style={styles.button} onPress={this._onCancel}><Text uppercase={false}>{getLabel("action.cancel")}</Text></Button>
            <Button danger style={styles.button} onPress={this._onConfirm}><Text uppercase={false}>{getLabel("action.yes")}</Text></Button>
          </View>
        </View>
      </Modal>
    );
  }
}

interface Style {
  buttons: ViewStyle;
  button: ViewStyle;
  modalInnerContainer: ViewStyle;
  titleContainer: ViewStyle;
  titleText: TextStyle;
  contentText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  buttons: {    
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  button: {
    flexGrow: 1,
    flexBasis: "50%",
    maxWidth: "50%",
    justifyContent: "center",
  },
  modalInnerContainer: {
    width: "100%",
    paddingBottom: 15
  },
  titleContainer: {
    margin: 0,
    paddingTop: 22,
    paddingBottom: 14,
    borderBottomColor: NBTheme.listBorderColor,
    borderBottomWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    width: "100%",
  },
  titleText: {
    color: NBTheme.brandPrimary,
    alignSelf: "center",
    ...mixins.themes.fontBold,
  },
  contentText: {
    marginTop: 22,
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
  }
})

export default ConfirmationModal;
