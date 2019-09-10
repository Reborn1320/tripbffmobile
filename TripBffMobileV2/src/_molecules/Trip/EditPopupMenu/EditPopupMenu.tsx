import React from 'react'
import { View, Icon } from 'native-base';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import menuOptionStyles from "../../../theme/variables/menuOptions.style.js";
import { PropsBase } from '../../../screens/_shared/LayoutContainer.js';
import { withNamespaces } from 'react-i18next';

export interface Props extends PropsBase {
  onSelect: (value) => void;
}

export interface State {
}

class EditPopupMenu extends React.Component<Props, State> {

  render() {
    const { t } = this.props;

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
            <MenuOption value={2} text={t("trip_detail:edit_trip_name_menu_label")} />
            <MenuOption value={1} text={t("trip_detail:edit_trip_date_range_menu_label")} />
          </MenuOptions>
        </Menu>
      </View>
    )
  }
}

export default withNamespaces(['trip_detail'])(EditPopupMenu);