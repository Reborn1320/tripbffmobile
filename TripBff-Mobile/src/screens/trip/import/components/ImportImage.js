import React, { Component } from "react";
import { FlatList } from "react";
import { Icon, Text } from "native-base";

class ImportImage extends Component {

    render() {
        const text = this.props;
        return (
            <FlatList>
                <Icon type="FontAwesome" name="home" />
                <Text>{text}</Text>
            </FlatList>
        );
    }

}

export default ImportImage;