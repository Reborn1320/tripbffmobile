import React from 'react'
import { View, Icon } from 'native-base';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

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
          <MenuTrigger customStyles={
            {
              triggerOuterWrapper: {
                // ...mixins.themes.debug,
              }
            }
          }
          >
            <Icon type="FontAwesome" name="cog"></Icon>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption value={1} text='Edit date range' />
          </MenuOptions>
        </Menu>
      </View>
    )
  }
}
