// this is the base modal that applied styles by default
//input: view content, isVisible
import React, { ReactNode } from "react";
import RNModal from "react-native-modal";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";
import { connectStyle, Text, H3 } from 'native-base';
import { mixins } from "../_utils";
import NBTheme from "../theme/variables/material.js";
import { View } from "react-native";

export interface Props {
  title?: string;
  isVisible: boolean;
  children?: ReactNode;
  style?: Style; //for native base to override
}

const MODAL_HEIGHT = 200;
const MODAL_MARGIN_TOP = 200; //todo improve margin with screenWidth

class ModalComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { isVisible, children, style } = this.props;
    const modalStyle = (style as any).modal;
    // const height = this.props.height ? this.props.height : MODAL_HEIGHT;
    // const marginTop = this.props.marginTop ? this.props.marginTop : MODAL_MARGIN_TOP;

    return (
      <RNModal
        isVisible={isVisible} hideModalContentWhileAnimating style={{height: null}}>
        <View style={{
          ...modalStyle,
          ...styles.content,
        }}>
          {this.props.title &&
            <View style={styles.titleContainer}>
              <H3 style={styles.title}>{this.props.title.toUpperCase()}</H3>
            </View>}
          {children}
        </View>
      </RNModal>
    );
  }
}

interface Style {
  content: ViewStyle;
  title: TextStyle;
  titleContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  // this withh warp around real content, then `style` will apply modal style on it
  content: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    // ...mixins.themes.debug2,
  },
  title: {
    // ...mixins.themes.debug2,
    color: NBTheme.brandLight,
    alignSelf: "flex-start"
  },
  titleContainer: {
    // ...mixins.themes.debug,
    alignSelf: "stretch",
    // height: 50,
    borderBottomColor: NBTheme.brandLight,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
  }
})

const Modal = connectStyle<typeof ModalComponent>('NativeBase.Modal', styles)(ModalComponent);
// const Modal = ModalComponent;
export default Modal;