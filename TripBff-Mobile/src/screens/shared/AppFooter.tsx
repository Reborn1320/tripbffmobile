import React, { Component } from "react";

import { Button, Icon, Text } from "native-base";
import { FooterTab } from "native-base";
import { PropsBase } from "../_shared/LayoutContainer";
import { NavigationConstants } from "../_shared/ScreenConstants";

export interface Props extends PropsBase {
  activeScreen: string;
}

export default class AppFooter extends Component<Props, any> {
  render() {
    return (
      <FooterTab>
        <Button
          vertical
          active={this.props.activeScreen === NavigationConstants.Screens.Login}
          onPress={() =>
            this.props.navigation.navigate(NavigationConstants.Screens.Login)
          }
        >
          <Icon active name="navigate" />
          <Text>Search</Text>
        </Button>
        <Button
          vertical
          active={this.props.activeScreen === NavigationConstants.Screens.TripCreation}
          onPress={() =>
            this.props.navigation.navigate(
              NavigationConstants.Screens.TripCreation
            )
          }
        >
          <Icon type="FontAwesome" name="plus-circle" />
          <Text>Create</Text>
        </Button>

        <Button
          vertical
          active={this.props.activeScreen === NavigationConstants.Screens.TripsList}
          onPress={() =>
            this.props.navigation.navigate(
              NavigationConstants.Screens.TripsList
            )
          }
        >
          <Icon name="person" />
          <Text>Profile</Text>
        </Button>
        <Button
          vertical
          active={this.props.activeScreen === NavigationConstants.Screens.TripsInfographicPreivew}
          onPress={() =>
            this.props.navigation.navigate(
              NavigationConstants.Screens.TripsInfographicPreivew
            )
          }
        >
          <Icon type="FontAwesome" name="eye" />
          <Text>Preview</Text>
        </Button>
      </FooterTab>
    );
  }
}
