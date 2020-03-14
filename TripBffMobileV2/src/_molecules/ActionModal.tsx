//this is the component that reuse `Modal` component and make it easy to use in the context of confirmation
//input: isVisible, title, content, button confirm handler.

import * as React from "react";
import { View, Text, Icon} from "native-base";
import { StyleSheet, ViewStyle, TouchableOpacity, TextStyle, SafeAreaView,  Modal } from "react-native";
import { connectStyle } from 'native-base';
import NBColor from "../theme/variables/material.js";
import { mixins } from "../_utils";

export interface Props {
  isVisible: boolean;
  title: string;
  onModalShowHandler?: ()=> void;
  onModalHideHandler?: () => void;
  onConfirmHandler: () => void;
  onCancelHandler: () => void;
}

interface State {
}

class ActionModalComponent extends React.PureComponent<Props, State> {
  render() {
      
    return (
      
        <Modal 
            presentationStyle={'fullScreen'}
            onShow={this.props.onModalShowHandler}
            onDismiss={this.props.onModalHideHandler}            
            onRequestClose={this.props.onCancelHandler}
            visible={this.props.isVisible}
            >              
            <SafeAreaView style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                  <TouchableOpacity onPress={this.props.onCancelHandler} style={styles.cancelButtonContainer}>
                      <Icon name="md-close" type="Ionicons" style={styles.cancelButtonIcon}></Icon>
                  </TouchableOpacity>
                  <Text style={styles.title}
                      >{this.props.title}
                  </Text>
                  <TouchableOpacity onPress={this.props.onConfirmHandler} style={styles.saveButtonContainer}>
                      <Icon name="md-checkmark" type="Ionicons" style={styles.saveButtonIcon}></Icon>
                  </TouchableOpacity>
                </View>
                <View style={styles.contentContainer}>
                  {this.props.children}
                </View>                
            </SafeAreaView>
        </Modal>
    );
  }
}

interface Style {
  modal: ViewStyle,
  buttons: ViewStyle;
  cancelButtonContainer: ViewStyle;
  cancelButtonIcon: TextStyle;
  title: TextStyle;
  saveButtonContainer: ViewStyle;
  saveButtonIcon: TextStyle;
  modalInnerContainer: ViewStyle;
  contentContainer: ViewStyle;  
}

const styles = StyleSheet.create<Style>({
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    marginBottom: 12
  },
  cancelButtonContainer: {
    marginTop: 15,
    marginLeft: 15
  },
  cancelButtonIcon: {
    fontSize: 26
  },
  title: {
    marginTop: 15,
    marginLeft: 10,
    color: NBColor.brandPrimary,
    fontSize: 18,
    fontStyle: "normal",
    fontFamily: mixins.themes.fontBold.fontFamily
  },
  saveButtonContainer:{
    marginTop: 15,
    marginRight: 20
  },
  saveButtonIcon: {
    fontSize: 26,
    color: NBColor.brandPrimary
  },
  modalInnerContainer: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  contentContainer: {
    flex: 1
  }
})

  
const ActionModal = connectStyle<typeof ActionModalComponent>('NativeBase.Modal', styles)(ActionModalComponent);
export default ActionModal;