// this is the base modal that applied styles by default
//input: view content, isVisible
import React, { ReactNode } from "react";
import RNModal from "react-native-modal";
import { ShadowPropTypesIOS } from "react-native";

export interface Props {
  isVisible: boolean;
  children?: ReactNode;
}

function Modal({ isVisible, children }: Props) {
  return (
    <RNModal isVisible={isVisible} style={{ backgroundColor: "gray" }}>
      {children}
    </RNModal>
  );
}

export default Modal;