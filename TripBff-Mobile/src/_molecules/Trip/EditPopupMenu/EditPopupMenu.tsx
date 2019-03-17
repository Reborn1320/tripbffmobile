import React from 'react'
import { View, Icon } from 'native-base';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { mixins } from '../../../_utils';
import NBTheme from "../../../theme/variables/material.js";

export interface Props {
  onSelect: (value) => void;
}

export interface State {
}

export default class EditPopupMenu extends React.Component<Props, State> {

  render() {
    return (
      <View>
        <Menu
          onSelect={this.props.onSelect}>
          <MenuTrigger>
            <Icon type="FontAwesome" name="cog"></Icon>
          </MenuTrigger>
          <MenuOptions customStyles={
            {
              optionsContainer: styles.itemsContainer,
              optionWrapper: styles.itemContainer,
              optionText: styles.item,
            }
          }>
            <MenuOption value={1} text='Edit date range' />
            <MenuOption value={2} text='Edit trip name' />
          </MenuOptions>
        </Menu>
      </View>
    )
  }
}

//todo: move to a base popup menu that can be reused
interface Style {
  itemsContainer: ViewStyle;
  itemContainer: ViewStyle;

  item: TextStyle;
}

const styles = StyleSheet.create<Style>({
  itemsContainer: {
    borderRadius: NBTheme.borderRadiusBase,
  },
  itemContainer: {
    // ...mixins.themes.debug,
    height: NBTheme.inputHeightBase,
    alignItems: "stretch",
    justifyContent: "center",
    paddingLeft: 15,
  },
  item: {
    fontFamily: NBTheme.fontFamily,
    fontSize: NBTheme.btnTextSize,
  }
})