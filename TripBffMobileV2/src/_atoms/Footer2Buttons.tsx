import React, { Component } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Button, Text, Footer } from 'native-base';
import _ from "lodash";
import { getLabel } from "../../i18n";

export interface Props {
  onCancel: () => void;
  onAction: () => void;
  cancelText: string;
  actionText: string;
  primary?: boolean;
  danger?: boolean;
}

interface State {
  primary: boolean;
  danger: boolean;
}

export default class Footer2Buttons extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      primary: this.props.primary ? this.props.primary : false,
      danger: this.props.danger ? this.props.danger : false,
    }

  }

  render() {
    const { cancelText, actionText } = this.props;
    const { primary, danger } = this.state;
    return (
      <Footer style={styles.container}>
        <Button transparent
          onPress={this.props.onCancel}
          style={styles.footerButton}
        >
          <Text>{getLabel(cancelText)}</Text>
        </Button>

        <Button
          primary={primary} danger={danger}
          onPress={this.props.onAction}
          style={styles.footerButton}
        >
          <Text>{getLabel(actionText)}</Text>
        </Button>
      </Footer>
    );
  }
}


interface Style {
  container: ViewStyle;
  footerButton: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 0,
    shadowColor: "black",
    elevation: 10,
    backgroundColor: "white"
  },
  footerButton: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    flexGrow: 1,
    justifyContent: "center",
    shadowColor: null,
  }
})