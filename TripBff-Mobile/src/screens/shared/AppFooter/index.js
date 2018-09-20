import React, { Component } from "react";

import { Button, Icon, Text } from 'native-base';
import { Footer, FooterTab } from 'native-base';

export default class AppFooter extends Component {
    render() {
        return (
            <FooterTab>
                <Button vertical>
                    <Icon active name="navigate" />
                    <Text>Search</Text>
                </Button>
                <Button vertical
                    onPress={() => this.props.navigation.navigate("TripCreation")}>
                    <Icon type="FontAwesome" name="plus-circle" />
                    <Text>Create</Text>
                </Button>

                <Button vertical active>
                    <Icon name="person" />
                    <Text>Profile</Text>
                </Button>
            </FooterTab>
        );
    }
}
