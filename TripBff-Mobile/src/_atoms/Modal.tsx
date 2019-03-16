// this is the base modal that applied styles by default
//input: view content, isVisible
import React, { ReactNode, FunctionComponentElement } from "react";
import RNModal from "react-native-modal";
import { ViewStyle, StyleSheet } from "react-native";
import { connectStyle } from 'native-base';

export interface Props {
  isVisible: boolean;
  children?: ReactNode;
  style?: Style;
}

class ModalComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    var { isVisible, children, style } = this.props;

    return (
      <RNModal style={style.modal} 
       isVisible={isVisible} hideModalContentWhileAnimating >
        {children}
      </RNModal>
    );
  }
}

interface Style {
  modal: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  modal: {
    height: 200,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200, //todo improve margin with screenWidth
    // ...mixins.themes.debug,
  }
})

const Modal = connectStyle<typeof ModalComponent>('NativeBase.Modal', styles)(ModalComponent);
export default Modal;