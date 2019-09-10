import React, { Component } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Button, Text, Footer } from 'native-base';
import _ from "lodash";
import { withNamespaces } from "react-i18next";
import { PropsBase } from "../screens/_shared/LayoutContainer";

export interface Props extends PropsBase {
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

class Footer2Buttons extends Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
      primary: this.props.primary ? this.props.primary : false,
      danger: this.props.danger ? this.props.danger : false,
    }

  }

  render() {
    const { cancelText, actionText, t } = this.props;
    const { primary, danger } = this.state;
    return (
      <Footer style={styles.container}>
        <Button transparent
          onPress={this.props.onCancel}
          style={styles.footerButton}
        >
          <Text>{t(cancelText)}</Text>
        </Button>

        <Button
          primary={primary} danger={danger}
          onPress={this.props.onAction}
          style={styles.footerButton}
        >
          <Text>{t(actionText)}</Text>
        </Button>
      </Footer>
    );
  }
}

export default withNamespaces(['import'])(Footer2Buttons);

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