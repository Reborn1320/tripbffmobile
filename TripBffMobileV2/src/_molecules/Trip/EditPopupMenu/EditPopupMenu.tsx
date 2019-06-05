import React from 'react'
import { View, Icon } from 'native-base';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import menuOptionStyles from "../../../theme/variables/menuOptions.style.js";

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
              optionsContainer: menuOptionStyles.optionsContainer,
              optionWrapper: menuOptionStyles.optionWrapper,
              optionText: menuOptionStyles.optionText,
            }
          }>
            <MenuOption value={2} text='Edit trip name' />
            <MenuOption value={1} text='Edit date range' />
          </MenuOptions>
        </Menu>
      </View>
    )
  }
}