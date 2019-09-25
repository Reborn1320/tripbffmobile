import React, { Component } from "react";
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  View,
  Left,
  Right,
  Icon,
} from "native-base";
import _ from "lodash";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { logOut } from "../../store/User/operations";
import { withNamespaces } from "react-i18next";
import { PropsBase } from "../_shared/LayoutContainer";

export interface Props extends PropsBase {
  updateLocale: (locale: string) => Promise<void>;
}

interface State {}

class UserSettingsScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t("setting:header_title"),
    headerRight: <View />,
  });

  private _changeLanguage = () => {
    this.props.navigation.navigate(
      NavigationConstants.Screens.LanguageSelection
    );
  };

  private _giveFeedback = () => {
    this.props.navigation.navigate(NavigationConstants.Screens.UserFeedback);
  };

  private _handleEditBtnClick = () => {
    logOut().then(() => {
      this.props.navigation.navigate(NavigationConstants.Screens.Login);
    });
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        <Content>
          <List>
            <ListItem onPress={this._changeLanguage}>
              <Left>
                <Text>{t("setting:language_setting_label")}</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem onPress={this._giveFeedback}>
              <Left>
                <Text>{t("setting:feedback_setting_label")}</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem onPress={this._handleEditBtnClick}>
              <Left>
                <Text>{t("setting:logout_setting_label")}</Text>
              </Left>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export default withNamespaces(["setting"])(UserSettingsScreen);
