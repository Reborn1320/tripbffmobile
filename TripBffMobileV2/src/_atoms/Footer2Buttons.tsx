import React, { Component } from "react";
import { FlatList, View, BackHandler, StyleSheet, ViewStyle } from "react-native";
import { Container, Content, Button, Text, Footer, Toast } from 'native-base';
import _ from "lodash";
import { getLabel } from "../../i18n";

export interface Props {
  onCancel: () => void;
  onAction: () => void;
}

interface State {

}

export default class Footer2Buttons extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
    }

  }

  render() {
    return (
      <Footer
        style={{
          justifyContent: "space-between", alignItems: "stretch", padding: 0,
          shadowColor: "black", elevation: 10,
          backgroundColor: "white"
        }}
      >
        <Button transparent
          onPress={this.props.onCancel}
          style={styles.footerButton}
        >
          <Text>{getLabel("import.skip_button")}</Text>
        </Button>

        <Button primary
          onPress={this.props.onAction}
          style={styles.footerButton}
        >
          <Text>{getLabel("import.import_button")}</Text>
        </Button>
      </Footer>
    );
  }
}


interface Style {
  footerButton: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  footerButton: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    flexGrow: 1,
    justifyContent: "center",
    shadowColor: null,
  }
})